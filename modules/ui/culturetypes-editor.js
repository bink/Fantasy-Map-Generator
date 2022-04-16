"use strict";
function editCultureTypes() {
	const cultureTypes = pack.cultureTypes;
	if (customization) return;
	closeDialogs("#cultureTypesEditor, .stable");
	$("#cultureTypesEditor").dialog();

	const body = document.getElementById("cultureTypesBody");

	refreshCultureTypesEditor();

	if (modules.editCultureTypes) return;
	modules.editCultureTypes = true;


	$("#cultureTypesEditor").dialog({
		title: "Culture type editor",
		resizable: false,
		width: fitContent(),
		close: closeCultureTypesEditor,
		position: { my: "right top", at: "right-10 top+10", of: "svg"}
	});
	body.focus();

	// add listeners
	body.querySelectorAll("div > input.cultureTypeName").forEach(el => el.addEventListener("input",cultureTypeChangeName));
	body.querySelectorAll("div > input.cultureTypeExpansionism").forEach(el => el.addEventListener("change",cultureTypeChangeExpansionism));
	body.querySelectorAll("div > .cultureTypeEditPenalties").forEach(el => el.addEventListener("click",openPenaltyEditor));

	function refreshCultureTypesEditor() {
		cultureTypesEditorAddLines();
	}

	function cultureTypesEditorAddLines() {
		let lines = "";
		for (const [i,c] of pack.cultureTypes.entries()) {
			lines += `<div class="states cultures cultureTypes" data-id="${i}" data-name="${c.name}" data-expansionism="${c.expansionism}">
				<input data-tip="Culture type name. Click and type to change" class="cultureTypeName" value="${c.name}" autocorrect="off" spellcheck="false">
				<input data-tip="Culture type expansionism. Defines competitive size. Click to change" class="cultureTypeExpansionism" class="statePower hide" type="number" min=0 max=99 step=.1 value="${c.expansionism}">
        		<span data-tip="Edit penalties" class="cultureTypeEditPenalties icon-pencil"></span>
			</div>`;
		}
		body.innerHTML = lines;

		applySorting(cultureTypesHeader);
		$("#cultureTypesEditor").dialog({width: fitContent()});

	}

	function cultureTypeChangeName() {
		const cultureType = +this.parentNode.dataset.id;
		this.parentNode.dataset.name = this.value;
		pack.cultureTypes[cultureType].name = this.value;
	}

	function cultureTypeChangeExpansionism() {
		const cultureType = +this.parentNode.dataset.id;
		this.parentNode.dataset.expansionism = this.value;
		pack.cultureTypes[cultureType].expansionism = this.value;
	}

	function closeCultureTypesEditor() {
		// TODO: Figure out how to refresh the cultures editor from here
		//refreshCulturesEditor();
	}

	function openPenaltyEditor() {
		const cultureType = +this.parentNode.dataset.id;
		editCultureTypePenalties(cultureType);
	}
}