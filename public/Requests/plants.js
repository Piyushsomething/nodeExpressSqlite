async function loadPlants() {
    const response = await fetch(`${apiUrl}/plants`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
  
    const areaSelect = document.getElementById("plant-area");
    const varietySelect = document.getElementById("plant-variety");
    areaSelect.innerHTML = "";
    varietySelect.innerHTML = "";
  
    data.plants.forEach((plant) => {
      const option = document.createElement("option");
      option.value = plant.id;
      option.textContent = plant.area;
      areaSelect.appendChild(option);
  
      const varietyOption = document.createElement("option");
      varietyOption.value = plant.id;
      varietyOption.textContent = plant.variety;
      varietySelect.appendChild(varietyOption);
    });
  }
  
  async function submitPlantRequest(e) {
    e.preventDefault();
    const plantId = document.getElementById("plant-area").value;
    const area =
      document.getElementById("plant-area").options[
        document.getElementById("plant-area").selectedIndex
      ].text;
    const variety =
      document.getElementById("plant-variety").options[
        document.getElementById("plant-variety").selectedIndex
      ].text;
    const number = document.getElementById("plant-number").value;
  
    const response = await fetch(`${apiUrl}/requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ plantId, area, variety, number }),
    });
  
    const data = await response.json();
    alert(data.message);
  }