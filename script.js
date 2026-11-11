const gates = [
  { id:'and', name:'AND', short:'AND', inputs:['A','B'], expression:'Y = A · B', help:'Y is 1 only when both A and B are 1.', fn:([a,b])=>a&b },
  { id:'or', name:'OR', short:'OR', inputs:['A','B'], expression:'Y = A + B', help:'Y is 1 when either input (or both) is 1.', fn:([a,b])=>a|b },
  { id:'not', name:'NOT', short:'NOT', inputs:['A'], expression:'Y = A′', help:'Y is the opposite value of A.', fn:([a])=>1-a },
  { id:'nand', name:'NAND', short:'NAND', inputs:['A','B'], expression:'Y = (A · B)′', help:'Y is 0 only when both inputs are 1.', fn:([a,b])=>1-(a&b) },
  { id:'nor', name:'NOR', short:'NOR', inputs:['A','B'], expression:'Y = (A + B)′', help:'Y is 1 only when both inputs are 0.', fn:([a,b])=>1-(a|b) },
  { id:'xor', name:'XOR', short:'XOR', inputs:['A','B'], expression:'Y = A ⊕ B', help:'Y is 1 when the inputs are different.', fn:([a,b])=>a^b },
  { id:'xnor', name:'XNOR', short:'XNOR', inputs:['A','B'], expression:'Y = (A ⊕ B)′', help:'Y is 1 when the inputs are the same.', fn:([a,b])=>1-(a^b) },
  { id:'buffer', name:'Buffer', short:'BUF', inputs:['A'], expression:'Y = A', help:'A buffer copies A to the output.', fn:([a])=>a }
];
const circuits = [
  {id:'half',name:'Half Adder',inputs:['A','B'],outputs:['Sum','Carry'],expression:'Sum = A ⊕ B ·  Carry = A · B',help:'Adds two bits. Sum is XOR; Carry is AND.',fn:([a,b])=>[a^b,a&b]},
  {id:'full',name:'Full Adder',inputs:['A','B','Cin'],outputs:['Sum','Cout'],expression:'Sum = A ⊕ B ⊕ Cin  ·  Cout = AB + Cin(A ⊕ B)',help:'Adds A, B, and carry-in to produce a sum and carry-out.',fn:([a,b,c])=>[a^b^c,(a&b)|(c&(a^b))]},
  {id:'mux',name:'2-to-1 Multiplexer',inputs:['A','B','Select'],outputs:['Y'],expression:'Y = A (Select=0), B (Select=1)',help:'Select chooses which input reaches the output.',fn:([a,b,s])=>[s?b:a]},
  {id:'sr',name:'SR Latch',inputs:['S','R'],outputs:['Q','Q′'],expression:'Set: S=1 → Q=1 · Reset: R=1 → Q=0',help:'Stores one bit. S=R=1 is invalid; 00 holds the previous state.',sequential:'sr'},
  {id:'dff',name:'D Flip-Flop',inputs:['D','Clock'],outputs:['Q','Q′'],expression:'Rising clock edge: Q ← D',help:'Captures D only when Clock rises. Use the clock button.',sequential:'dff'}
];
const lessons = [
 ['01','Binary numbers','Digital circuits use 0 and 1. Each binary place is a power of two: 101₂ = 4 + 0 + 1 = 5.'],
 ['∧','Logic gates','Gates apply simple rules to binary inputs. For example, AND gives 1 only for input 11.'],
 ['ƒ','Boolean algebra','Boolean expressions describe logic with symbols. A · B means AND; A + B means OR; a prime means NOT.'],
 ['▦','Truth tables','A truth table lists every input combination and its output. Two inputs have 2² = 4 combinations.'],
 ['↗','Combinational circuits','Outputs depend only on current inputs. Adders and multiplexers are common examples.'],
 ['◷','Sequential circuits','These circuits also store state. A latch responds to its inputs; a flip-flop stores data on a clock edge.'],
 ['＋','Half & full adders','A half adder adds two bits. A full adder also accepts carry-in, so it can join stages in a larger sum.'],
 ['⇄','Multiplexer','A multiplexer routes one of several inputs to an output. A 2-to-1 mux uses one select bit.'],
 ['▣','Flip-flops','A D flip-flop stores one bit from D at the rising edge of its clock. Example: D=1 at the edge makes Q=1.']
];
const questions = [
 ['What is the output of AND for A=1, B=0?',['0','1','A','Undefined'],0,'AND needs both inputs to be 1.'],
 ['Which gate gives 1 when its inputs differ?',['OR','XNOR','XOR','NAND'],2,'XOR is true when the inputs are different.'],
 ['What does a NOT gate do?',['Adds inputs','Inverts its input','Stores a bit','Selects an input'],1,'NOT changes 0 to 1 and 1 to 0.'],
 ['What is 101₂ in decimal?',['3','4','5','6'],2,'101₂ = 4 + 1 = 5.'],
 ['How many rows does a 3-input truth table have?',['4','6','8','9'],2,'Three inputs have 2³ = 8 combinations.'],
 ['A half adder Carry output is which operation?',['OR','XOR','AND','NOT'],2,'Carry is A AND B.'],
 ['What does Cin mean on a full adder?',['Clock input','Carry-in','Circuit index','Complement input'],1,'Cin is the carry bit from a previous adder stage.'],
 ['In a 2-to-1 mux, what happens when Select=1?',['Y=A','Y=B','Y=0','Y toggles'],1,'Select=1 routes B to Y.'],
 ['Which SR latch input state is invalid here?',['S=0,R=0','S=0,R=1','S=1,R=0','S=1,R=1'],3,'The basic active-high SR latch forbids S=R=1.'],
 ['When does a positive-edge D flip-flop update Q?',['When D changes','On clock falling edge','On clock rising edge','Continuously'],2,'It captures D at the rising clock edge.']
];
const $ = s => document.querySelector(s);
const gateChoices=$('#gateChoices'), circuitChoices=$('#circuitChoices');
let selected={type:'gate',id:'and'}, inputs={}, latchQ=0, flipQ=0, previousClock=0, quizIndex=0, quizScore=0, quizLocked=false;

function renderChoices(){
  gateChoices.innerHTML=gates.map(g=>`<button class="choice" data-type="gate" data-id="${g.id}" title="Select ${g.name} gate"><strong>${g.short}</strong><small>${g.inputs.length} input${g.inputs.length>1?'s':''}</small></button>`).join('');
  circuitChoices.innerHTML=circuits.map(c=>`<button data-type="circuit" data-id="${c.id}">${c.name}</button>`).join('');
  document.querySelectorAll('.choice,.choice-list button').forEach(b=>b.addEventListener('click',()=>selectComponent(b.dataset.type,b.dataset.id)));
}
function component(){const c=(selected.type==='gate'?gates:circuits).find(c=>c.id===selected.id);return {...c,type:selected.type}}
function selectComponent(type,id){selected={type,id};inputs=Object.fromEntries(component().inputs.map(k=>[k,0]));if(id==='sr')latchQ=0;if(id==='dff'){flipQ=0;previousClock=0}renderSimulation()}
function allRows(c){
  if(c.id==='sr'||c.id==='dff')return Array.from({length:8},(_,i)=>[(i>>2)&1,(i>>1)&1,i&1]);
  const n=2**c.inputs.length;
  return Array.from({length:n},(_,i)=>c.inputs.map((_,j)=>(i>>(c.inputs.length-j-1))&1));
}
function result(c,values){if(c.type==='gate')return [c.fn(values)];if(c.sequential==='sr'){const [s,r]=values;if(s&&r)return [null,null];if(s)latchQ=1;else if(r)latchQ=0;return [latchQ,1-latchQ]}if(c.sequential==='dff'){const [d,clock]=values;if(clock&&!previousClock)flipQ=d;previousClock=clock;return [flipQ,1-flipQ]}return c.fn(values)}
function outputFor(c,row){
  if(c.type==='gate')return [c.fn(row)];
  if(['half','full','mux'].includes(c.id))return c.fn(row);
  if(c.id==='sr'){const [s,r,q]=row;if(s&&r)return ['X','X'];const next=s?1:r?0:q;return [next,1-next]}
  if(c.id==='dff'){const [d,edge,q]=row;const next=edge?d:q;return [next,1-next]}
  return [];
}
function makeTable(c,currentState=0){const sequential=['sr','dff'].includes(c.id),rows=allRows(c),stateHeaders=c.id==='sr'?['Q(t)']:c.id==='dff'?['Clock edge','Q(t)']:[],outputHeaders=sequential?['Q(t+1)','Q′(t+1)']:c.type==='gate'?['Y']:c.outputs,headers=[...c.inputs,...stateHeaders,...outputHeaders];$('#rowCount').textContent=`${rows.length} rows`;
  $('#truthTable thead').innerHTML=`<tr>${headers.map(h=>`<th scope="col">${h}</th>`).join('')}</tr>`;
  $('#truthTable tbody').innerHTML=rows.map(row=>{const out=outputFor(c,row),inputMatches=c.inputs.every((key,i)=>inputs[key]===row[i]),stateMatches=!sequential||row.at(-1)===currentState,current=inputMatches&&stateMatches;return `<tr class="${current?'current':''}">${[...row,...out].map(v=>`<td>${v}</td>`).join('')}</tr>`}).join('');
}
function renderInputs(c){$('#inputControls').innerHTML=c.inputs.map(k=>`<label class="switch-control" title="Toggle ${k}"><span>${k}</span><input type="checkbox" data-input="${k}" aria-label="${k} input" ${inputs[k]?'checked':''}><span class="bit-value">${inputs[k]}</span></label>`).join('');document.querySelectorAll('[data-input]').forEach(el=>el.addEventListener('change',()=>{const key=el.dataset.input;inputs[key]=Number(el.checked);if(selected.id==='sr'&&inputs.S&&inputs.R)$('#notice').textContent='Invalid state: S and R cannot both be 1.';else $('#notice').textContent='';renderSimulation(true)}))}
function svgDiagram(c,outs){
  const labels=c.inputs, positions=labels.length===1?[90]:labels.length===2?[65,115]:[48,90,132];
  if(c.type==='gate'){
    const id=c.id,inverted=['nand','nor','xnor','not'].includes(id),isOr=['or','nor','xor','xnor'].includes(id);
    let body='',text=id==='buffer'?'BUF':id.toUpperCase(),edge=270;
    if(isOr){body='<path class="gate-shape" d="M177 43 Q207 90 177 137 Q232 137 270 90 Q232 43 177 43 Z"/>';if(id==='xor'||id==='xnor')body+='<path fill="none" stroke="#8793a8" stroke-width="2" d="M167 43 Q197 90 167 137"/>';}
    else if(id==='not'){body='<path class="gate-shape" d="M188 47 L188 133 L251 90 Z"/>';edge=258;}
    else if(id==='buffer'){body='<rect class="gate-shape" x="184" y="60" width="72" height="60" rx="7"/>';edge=256;}
    else body='<path class="gate-shape" d="M180 43 H220 Q270 90 220 137 H180 Z"/>';
    if(inverted){const x=id==='not'?258:278;body+=`<circle class="gate-shape" cx="${x}" cy="90" r="7"/>`;edge=x+7;}
    const pinX=id==='not'?188:id==='buffer'?184:180;
    const inputsSvg=positions.map((y,i)=>`<path class="wire ${inputs[labels[i]]?'on':''}" d="M55 ${y} H${pinX}"/><text class="pin-label" x="40" y="${y+4}">${labels[i]}</text><circle cx="72" cy="${y}" r="4" fill="${inputs[labels[i]]?'#18a878':'#b8c1d1'}"/>`).join('');
    const active=outs[0]===1;
    return `<svg viewBox="0 0 440 180" role="img" aria-label="${c.name} logic gate symbol">${inputsSvg}${body}<text class="gate-label" x="218" y="95">${text}</text><path class="wire ${active?'on':''}" d="M${edge} 90 H355"/><circle class="led ${active?'on':''}" cx="374" cy="90" r="9"/><text class="pin-label" x="392" y="94">Y</text></svg>`;
  }
  const symbols={half:['XOR','AND'],full:['XOR','OR'],mux:['MUX'],sr:['SR LATCH'],dff:['D FLIP-FLOP']},names=symbols[c.id]||['CIRCUIT'],ys=names.length===1?[90]:[67,116];
  const blocks=names.map((n,i)=>`<rect class="gate-shape" x="205" y="${ys[i]-20}" width="105" height="40" rx="8"/><text class="gate-label" x="257" y="${ys[i]+4}">${n}</text>`).join('');
  const wiresIn=positions.map((y,i)=>`<path class="wire ${inputs[labels[i]]?'on':''}" d="M55 ${y} H205"/><text class="pin-label" x="40" y="${y+4}">${labels[i]}</text>`).join('');
  const outputs=outs.map((v,i)=>{const y=names.length===1&&outs.length>1?[78,108][i]:ys[Math.min(i,ys.length-1)];return `<path class="wire ${v===1?'on':''}" d="M310 ${y} H355"/><circle class="led ${v===1?'on':''}" cx="374" cy="${y}" r="8"/><text class="pin-label" x="390" y="${y+4}">${c.outputs[i]}</text>`}).join('');
  return `<svg viewBox="0 0 440 180" role="img" aria-label="${c.name} circuit visualization">${wiresIn}${blocks}${outputs}</svg>`;
}
function renderSimulation(preserveState=false){const c=component();if(!preserveState){$('#notice').textContent=''}$('#categoryLabel').textContent=selected.type==='gate'?'LOGIC GATE':'CIRCUIT';$('#simTitle').textContent=c.name+(selected.type==='gate'?' Gate':'');$('#simDescription').textContent=selected.type==='gate'?`A ${c.name.toLowerCase()} gate with ${c.inputs.length} input${c.inputs.length>1?'s':''}. Toggle inputs to explore its behavior.`:`Explore the ${c.name.toLowerCase()} by changing its inputs.`;$('#expression').textContent=c.expression;$('#expressionHelp').textContent=c.help;renderInputs(c);
 const priorState=c.id==='sr'?latchQ:flipQ;const outs=result(c,c.inputs.map(k=>inputs[k]));$('#circuitCanvas').innerHTML=svgDiagram(c,outs);const names=c.type==='gate'?['Y']:c.outputs;$('#outputControls').innerHTML=outs.map((v,i)=>`<span class="output-value"><i class="${v===1?'on':''}"></i>${names[i]} <b class="${v===1?'on':''}">${v===null?'—':v}</b></span>`).join('');makeTable(c,priorState);document.querySelectorAll('[data-type]').forEach(b=>b.classList.toggle('selected',b.dataset.type===selected.type&&b.dataset.id===selected.id));if(selected.id==='dff'){$('#inputControls').insertAdjacentHTML('beforeend','<button id="clockButton" class="primary-button" type="button" title="Create a rising clock edge">↑ Clock pulse</button>');$('#clockButton').addEventListener('click',clockPulse)}}
function clockPulse(){const el=document.querySelector('[data-input="Clock"]');if(inputs.Clock){inputs.Clock=0;renderSimulation(true)}inputs.Clock=1;renderSimulation(true);setTimeout(()=>{inputs.Clock=0;renderSimulation(true)},180)}
function downloadCsv(){const c=component(),stateHeaders=c.id==='sr'?['Q(t)']:c.id==='dff'?['Clock edge','Q(t)']:[],outputHeaders=['sr','dff'].includes(c.id)?['Q(t+1)','Q′(t+1)']:c.type==='gate'?['Y']:c.outputs,headers=[...c.inputs,...stateHeaders,...outputHeaders];const lines=[headers,...allRows(c).map(row=>[...row,...outputFor(c,row)])].map(r=>r.map(v=>{const s=String(v??'');return /[",\n]/.test(s)?`"${s.replaceAll('"','""')}"`:s}).join(',')).join('\r\n');const blob=new Blob([lines],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`${c.name.toLowerCase().replaceAll(/[^a-z0-9]+/g,'-')}-truth-table.csv`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function renderLessons(){$('#lessons').innerHTML=lessons.map(([icon,title,body])=>`<article class="lesson"><div class="lesson-icon">${icon}</div><h3>${title}</h3><p>${body}</p></article>`).join('')}
function renderQuiz(){quizLocked=false;const q=questions[quizIndex];$('#quizProgress').textContent=`QUESTION ${quizIndex+1} / ${questions.length}`;$('#progressBar').style.width=`${(quizIndex+1)*10}%`;$('#quizContent').innerHTML=`<p class="question">${quizIndex+1}. ${q[0]}</p><div class="options">${q[1].map((o,i)=>`<button class="option" data-option="${i}">${String.fromCharCode(65+i)}. &nbsp;${o}</button>`).join('')}</div><p id="feedback" class="feedback" aria-live="polite"></p><div class="quiz-footer"><small>Score: ${quizScore}</small><button id="nextQuestion" class="primary-button" disabled>${quizIndex===questions.length-1?'See result':'Next question'} →</button></div>`;document.querySelectorAll('[data-option]').forEach(b=>b.addEventListener('click',()=>answerQuestion(Number(b.dataset.option))));$('#nextQuestion').addEventListener('click',nextQuestion)}
function answerQuestion(i){if(quizLocked)return;quizLocked=true;const q=questions[quizIndex],correct=i===q[2];if(correct)quizScore++;document.querySelectorAll('[data-option]').forEach((b,n)=>{b.disabled=true;if(n===q[2])b.classList.add('correct');else if(n===i)b.classList.add('incorrect')});const fb=$('#feedback');fb.textContent=`${correct?'Correct!':'Not quite.'} ${q[3]}`;fb.classList.add(correct?'good':'bad');$('#quizContent .quiz-footer small').textContent=`Score: ${quizScore}`;$('#nextQuestion').disabled=false}
function nextQuestion(){quizIndex++;if(quizIndex===questions.length){$('#quizProgress').textContent='COMPLETE';$('#progressBar').style.width='100%';$('#quizContent').innerHTML=`<div class="result"><p class="eyebrow">QUIZ COMPLETE</p><h3>Your score</h3><div class="result-score">${quizScore}<span style="font-size:18px;color:var(--muted)"> / 10</span></div><p>${quizScore>=8?'Excellent work!':quizScore>=5?'Good progress. Keep exploring the simulator.':'Keep practicing; the Learn tab is a good place to start.'}</p><button id="restartQuiz" class="primary-button">↻ Restart quiz</button></div>`;$('#restartQuiz').addEventListener('click',()=>{quizIndex=0;quizScore=0;renderQuiz()})}else renderQuiz()}
document.querySelectorAll('.tab').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.tab,.tab-panel').forEach(x=>x.classList.remove('active'));b.classList.add('active');$('#'+b.dataset.tab).classList.add('active')}));$('#themeToggle').addEventListener('click',()=>{const dark=document.documentElement.classList.toggle('dark');$('#themeToggle').textContent=dark?'☀':'☾';$('#themeToggle').setAttribute('aria-label',dark?'Switch to light mode':'Switch to dark mode')});$('#downloadCsv').addEventListener('click',downloadCsv);
renderChoices();renderLessons();renderQuiz();selectComponent('gate','and');
