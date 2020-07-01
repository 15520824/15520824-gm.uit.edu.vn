import AComp from "absol-acomp";
import Dom from "absol/src/HTML5/Dom";

var Fcore = new Dom();


Fcore.traceOutBoundingClientRect = Dom.traceOutBoundingClientRect;
Fcore.install(AComp.core);
export default Fcore;
