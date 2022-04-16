"use strict";
function editCultureTypePenalties(id) {
	if (customization) return;
	if (elSelected && id === elSelected.attr("id")) return;
	closeDialogs(".stable");

	const heightPenaltiesBody = document.getElementById("heightPenalties");
	const biomePenaltiesBody = document.getElementById("biomePenalties");

	const cultureTypeId = id;

	$("#cultureTypePenaltiesEditor").attr("cultureTypeId",id);

	updatePenaltyData();

	$("#cultureTypePenaltiesEditor").dialog({
		title: "Edit culture type penalties",
		resizable: false,
		position: {my: "left top", at: "left+10 top+10", of: "#map"},
		close: closeCultureTypePenaltiesEditor
	});

	if (modules.editCultureTypePenalties) return;
	modules.editCultureTypePenalties = true;

	// add listeners
	document.getElementById("nativeBiomePenalty").addEventListener("change", changeNativeBiomePenalty);
	document.getElementById("nonNativeBiomePenalty").addEventListener("change", changeNonNativeBiomePenalty);
	document.getElementById("riverPenaltyMin").addEventListener("change", changeRiverPenaltyMin);
	document.getElementById("riverPenaltyMax").addEventListener("change", changeRiverPenaltyMax);
	
	document.getElementById("heightPenaltiesAdd").addEventListener("click", addHeightPenalty);
	document.getElementById("biomePenaltiesAdd").addEventListener("click", addBiomePenalty);
	

	function getCultureType() {
		const cultureTypeId = +$("#cultureTypePenaltiesEditor").attr("cultureTypeId");
		const cultureType = pack.cultureTypes[cultureTypeId];
		return cultureType;
	}

	function getBiomeOptions(biome) {
		let options = "";
		for (const i of biomesData.i) {
			options += `<option value=${i} ${i == biome ? "selected" : ""}>${biomesData.name[i]}</option>`
		}
		return options;
	}

	function updatePenaltyData() {
		const c = getCultureType();
		document.getElementById("nativeBiomePenalty").value = c.nativeBiomePenalty;
		document.getElementById("nonNativeBiomePenalty").value = c.nonNativeBiomePenalty;
		document.getElementById("riverPenaltyMin").value = c.riverPenaltyMin;
		document.getElementById("riverPenaltyMax").value = c.riverPenaltyMax;

		// add height penalty data
		let heightLines = "";
		// TODO: What is the maximum height??
		for (const [i,hp] of c.heightPenalties.entries()) {
			heightLines += `<div class="states heightPenalties" data-id="${i}">
				<input data-tip="Height from which this penalty is applied" class="heightPenaltyHeight" value=${hp.height} type="number" min=0  />
				<input data-tip="Penalty to be applied" class="heightPenaltyPenalty" value=${hp.penalty} type="number" min=0 />
				<span data-tip="Remove height penalty" class="icon-trash-empty hide removeHeightPenalty"></span>
			</div>`;
		}

		heightPenaltiesBody.innerHTML = heightLines;

		heightPenaltiesBody.querySelectorAll("div > .heightPenaltyHeight").forEach(el => el.addEventListener("change",heightPenaltyChangeHeight));
		heightPenaltiesBody.querySelectorAll("div > .heightPenaltyPenalty").forEach(el => el.addEventListener("change",heightPenaltyChangePenalty));
		heightPenaltiesBody.querySelectorAll("div > .removeHeightPenalty").forEach(el => el.addEventListener("click",removeHeightPenalty));

		// add biome penalty data
		let biomeLines = "";
		for (const [i,bp] of c.biomePenalties.entries()) {
			biomeLines += `<div class="states biomePenalties" data-id="${i}">
				<select data-tip="Biome that the penalty applies to" class="biomePenaltyBiome">
					${getBiomeOptions(bp.biome)}
				</select>
				<input data-tip="Penalty to be applied" class="biomePenaltyPenalty" value=${bp.penalty} type="number" min=0 />
				<span data-tip="Remove biome penalty" class="icon-trash-empty hide removeBiomePenalty"></span>
			</div>`
		}

		biomePenaltiesBody.innerHTML = biomeLines;

		biomePenaltiesBody.querySelectorAll("div > .biomePenaltyBiome").forEach(el => el.addEventListener("change",biomePenaltyChangeBiome));
		biomePenaltiesBody.querySelectorAll("div > .biomePenaltyPenalty").forEach(el => el.addEventListener("change",biomePenaltyChangePenalty));
		biomePenaltiesBody.querySelectorAll("div > .removeBiomePenalty").forEach(el => el.addEventListener("change",removeBiomePenalty));
	}


	function changeNativeBiomePenalty() {
		getCultureType().nativeBiomePenalty = this.value;
	}


	function changeNonNativeBiomePenalty() {
		getCultureType().nonNativeBiomePenalty = this.value;
	}


	function changeRiverPenaltyMin() {
		getCultureType().riverPenaltyMin = this.value;
	}


	function changeRiverPenaltyMax() {
		getCultureType().riverPenaltyMax = this.value;
	}

	function addHeightPenalty() {
		const hp = getCultureType().heightPenalties;
		const h = hp.at(-1).height;
		const p = hp.at(-1).penalty;
		hp.push({height:h+1,penalty:p});
		updatePenaltyData();
	}

	function removeHeightPenalty() {
		const hp = +this.parentNode.dataset.id;

		// TODO: Maybe add a dialog
		const penalties = getCultureType().heightPenalties;
		if (penalties.length <= 1) return; // Can't remove the last penalty
		getCultureType().heightPenalties.splice(hp,1);
		updatePenaltyData();

	}

	function sortHeightPenalties() {
		const hp = getCultureType().heightPenalties;
		hp.sort((a,b) => a.height - b.height);
		updatePenaltyData();
	}

	function heightPenaltyChangeHeight() {
		const hp = +this.parentNode.dataset.id;
		getCultureType().heightPenalties[hp].height = this.value;
		sortHeightPenalties();
	}

	function heightPenaltyChangePenalty() {
		const hp = +this.parentNode.dataset.id;
		getCultureType().heightPenalties[hp].penalty = this.value;
		sortHeightPenalties();
	}

	function addBiomePenalty() {
		const bp = {"biome":0,"penalty":0}
		getCultureType().biomePenalties.push(bp);
		updatePenaltyData();
	}

	function removeBiomePenalty() {
		const bp = +this.parentNode.dataset.id;

		// TODO: maybe add a dialog
		getCultureType().biomePenalties.splice(bp,1)
		updatePenaltyData();
	}

	function biomePenaltyChangeBiome() {
		const bp = +this.parentNode.dataset.id;
		getCultureType().biomePenalties[bp].biome = this.value;
		updatePenaltyData();
	}

	function biomePenaltyChangePenalty() {
		const bp = +this.parentNode.dataset.id;
		getCultureType().biomePenalties[bp].penalty = this.value;
		updatePenaltyData();
	}

	function closeCultureTypePenaltiesEditor() {

	}
}