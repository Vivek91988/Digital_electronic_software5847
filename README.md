🔌 Digital Electronics Logic Gate Simulator
[@profprabhat7-lang](https://github.com/profprabhat7-lang)

Explore digital logic by changing an input and watching the circuit respond.
A local, interactive learning lab for logic gates, Boolean expressions, truth tables, and foundational circuits.

HTML   CSS   Vanilla JavaScript   No dependencies

✨ What is this project?
The Interactive Logic Gate Simulator and Truth Table Generator is a beginner-friendly digital electronics tool that makes Boolean logic visible. Choose a gate or a ready-made circuit, flip its binary input switches, and immediately see the resulting output, signal path, and matching truth-table row.

The project connects three ways of describing the same digital system:

A circuit view shows inputs flowing through a gate or circuit block to output indicators.
A Boolean expression writes the rule as a compact mathematical statement.
A truth table lists the output for every allowed input combination.
This side-by-side view helps learners move from a rule such as Y = A · B, to its gate symbol, to the output for each binary input. It is suitable for first-year engineering students, teachers, hobbyists, and anyone building a foundation in digital logic.

🧭 How the simulator works

The app runs entirely in the browser. It does not send circuit inputs anywhere or need a server, database, account, API, package install, or build step.

🎛️ Gates and circuits
Logic gates
Gate	Boolean expression	Output rule
AND	Y = A · B	1 only when both inputs are 1
OR	Y = A + B	1 when either input is 1
NOT	Y = A′	Inverts the input
NAND	Y = (A · B)′	0 only when both inputs are 1
NOR	Y = (A + B)′	1 only when both inputs are 0
XOR	Y = A ⊕ B	1 when the inputs differ
XNOR	Y = (A ⊕ B)′	1 when the inputs match
Buffer	Y = A	Copies the input to the output
Each gate has an SVG symbol, labeled binary switches, a live output LED, and a complete truth table. Two-input gates show all four combinations; NOT and Buffer show both one-input combinations. The active input row is highlighted as you toggle the switches.

Ready-made circuits
Circuit	Inputs → outputs	Behavior shown in the app
Half adder	A, B → Sum, Carry	Sum = A ⊕ B; Carry = A · B
Full adder	A, B, Cin → Sum, Cout	Adds two bits and a carry-in; the table covers all eight input combinations
2-to-1 multiplexer	A, B, Select → Y	Select=0 routes A; Select=1 routes B
SR latch	S, R → Q, Q′	Set, reset, and hold behavior with the invalid S=R=1 state marked X
D flip-flop	D, Clock → Q, Q′	Captures D at a rising clock edge and otherwise retains its stored state
The sequential-circuit characteristic tables include the previous state (Q(t)) and next state (Q(t+1)). For the flip-flop table, Clock edge = 1 means a rising edge occurs; Clock edge = 0 means no rising edge, so the stored value holds. In the interactive circuit, use Clock pulse to create a rising edge. The SR latch displays a warning for the invalid input combination and keeps its previous stored output.

📚 Learning and practice
Learn tab: short explanations of binary numbers, gates, Boolean algebra, truth tables, combinational and sequential circuits, adders, multiplexers, and flip-flops.
Quiz tab: ten multiple-choice questions, one at a time, with immediate feedback, a final score, and a restart option.
CSV export: download the selected truth table with a header row. Sequential-circuit exports include their state columns and characteristic rows.
Display options: switch between light and dark themes; the layout adapts for desktop, tablet, and mobile screens.
🧱 Project structure
digital-electronics-simulator/
├── index.html   # Page structure, navigation, and simulator panels
├── style.css    # Theme, circuit styling, and responsive breakpoints
├── script.js    # Gate logic, circuit state, tables, CSV, lessons, and quiz
└── README.md    # Project guide
Main JavaScript functions
Function	Responsibility
selectComponent()	Selects a gate or circuit and initializes its input/state values
result()	Computes combinational outputs and applies SR latch or rising-edge flip-flop behavior
allRows() / outputFor()	Enumerate input/state combinations and calculate their characteristic outputs
renderSimulation() / makeTable()	Refresh the SVG, switches, output LEDs, expression, and truth table
clockPulse()	Creates a manual rising clock edge for the D flip-flop
downloadCsv()	Builds a correctly headed CSV and starts a browser download
renderQuiz() / answerQuestion() / nextQuestion()	Present quiz questions, check answers, and calculate the final score
🚀 Run it locally
Option 1: Open the file
Open index.html in a modern web browser. No installation or internet connection is needed.

Option 2: Start a local static server
From this project directory, run:

python -m http.server 8000
Then open http://localhost:8000.

Try a circuit
Select a gate or circuit in the Components panel.
Toggle its input switches. The diagram, output, and current truth-table row update immediately.
For the D flip-flop, change D and press Clock pulse to capture the value.
Choose Download as CSV to save the selected table.
Open Learn for concept summaries or Quiz to check your understanding.
🧰 Technologies and design
HTML5 provides semantic sections, navigation, buttons, labels, and tables.
CSS3 provides grid/flex layouts, responsive breakpoints, themes, switch styling, and signal indicators.
Vanilla JavaScript (ES6) implements Boolean functions, sequential state, generated table rows, quiz flow, and CSV creation.
Inline SVG draws gate symbols and circuit diagrams without image assets or a rendering library.
Browser APIs (Blob, object URLs, and a temporary download link) create CSV downloads locally.
♿ Usability
Input switches are labeled and use native checkbox keyboard behavior. Buttons are keyboard-focusable, focus is visible, and live feedback uses status announcements. The interface also keeps binary values beside switches and outputs, so state is not communicated by color alone.

🖼️ Screenshots
Screenshots can be added here after capturing the simulator in a browser.

🔭 Possible next steps
Let learners connect gates to create custom circuits.
Add timing diagrams for sequential circuits.
Add printable tables and Boolean-expression simplification.
Add guided exercises for converting between expressions, diagrams, and tables.
👤 Author
Vivek Singh
