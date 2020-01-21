import VffCol from "./components/vff-col";
import VffRow from "./components/vff-row";
import VffTable from "./components/vff-table";
import DragButton from './components/vff-drag-button';

window.customElements.define("vff-table", VffTable);
window.customElements.define("vff-row", VffRow);
window.customElements.define("vff-col", VffCol);
window.customElements.define('vff-drag-button', DragButton);
