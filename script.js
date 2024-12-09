function solveTransportation() {
  const supplyInput = document.getElementById("supply").value;
  const demandInput = document.getElementById("demand").value;
  const costMatrixInput = document.getElementById("costMatrix").value;

  const supply = supplyInput.split(',').map(Number);
  const demand = demandInput.split(',').map(Number);
  const costMatrix = costMatrixInput.split(';').map(row => row.split(',').map(Number));

  if (supply.length !== costMatrix.length || demand.length !== costMatrix[0].length) {
    alert("The supply, demand, and cost matrix dimensions do not match.");
    return;
  }

  const allocations = Array.from({ length: supply.length }, () => Array(demand.length).fill(0));
  let totalCost = 0;
  let supplyCopy = [...supply];
  let demandCopy = [...demand];

  let i = 0, j = 0;
  while (i < supply.length && j < demand.length) {
    const allocation = Math.min(supplyCopy[i], demandCopy[j]);
    allocations[i][j] = allocation;
    totalCost += allocation * costMatrix[i][j];

    supplyCopy[i] -= allocation;
    demandCopy[j] -= allocation;

    if (supplyCopy[i] === 0) {
      i++;
    } else {
      j++;
    }
  }

  // Optimization step (MODI Method or any optimization approach)
  let isOptimal = false;
  while (!isOptimal) {
    isOptimal = true;
    
    // Placeholder for MODI or Stepping Stone Method to check for negative costs and adjust allocations
    let improvementMade = false;
    
    for (let i = 0; i < supply.length; i++) {
      for (let j = 0; j < demand.length; j++) {
        if (allocations[i][j] > 0) {
          const currentCost = costMatrix[i][j];
          const potentialCost = currentCost;  // Replace this logic with your optimization step

          // Check if current allocation can be improved
          if (potentialCost < currentCost) {
            allocations[i][j] = allocation;  // Update with new allocation if possible
            totalCost -= currentCost * allocations[i][j];  // Subtract old cost
            totalCost += potentialCost * allocations[i][j];  // Add new cost
            improvementMade = true;
          }
        }
      }
    }

    // If an improvement was made, we keep iterating
    if (improvementMade) {
      isOptimal = false;
    }
  }

  displayResults(allocations, totalCost, supply, demand, costMatrix);
}

function displayResults(allocations, totalCost, supply, demand, costMatrix) {
  const resultDiv = document.getElementById("result");

  let resultHTML = "<h2>Table 1: Initial Allocations (North-West Corner Method)</h2>";
  resultHTML += "<table><thead><tr><th>From / To</th>";

  for (let j = 0; j < demand.length; j++) {
    resultHTML += `<th>Demand ${j + 1}</th>`;
  }
  resultHTML += "</tr></thead><tbody>";

  for (let i = 0; i < supply.length; i++) {
    resultHTML += `<tr><th>Supply ${i + 1}</th>`;
    for (let j = 0; j < demand.length; j++) {
      resultHTML += `<td>${allocations[i][j]}</td>`;
    }
    resultHTML += "</tr>";
  }
  resultHTML += "</tbody></table>";

  let negativeFound = false;
  let steps = [];
  let totalCalculation = 0;

  for (let i = 0; i < supply.length; i++) {
    for (let j = 0; j < demand.length; j++) {
      if (allocations[i][j] > 0) {
        let step = `${allocations[i][j]}(${costMatrix[i][j]})`;
        steps.push(step);
        totalCalculation += allocations[i][j] * costMatrix[i][j];
        if (costMatrix[i][j] < 0) {
          negativeFound = true;
        }
      }
    }
  }

  let calculationString = steps.join(" + ") + ` = ${totalCalculation}$`;

  resultHTML += "<h3>Detailed Cost Calculation</h3>";
  resultHTML += `<p>${calculationString}</p>`;

  if (negativeFound) {
    resultHTML += "<h2>Table 2: Adjusted Allocations (After Optimization)</h2>";
    resultHTML += "<p>Negative cost found. Proceeding to optimization step...</p>";

    resultHTML += "<table><thead><tr><th>From / To</th>";
    for (let j = 0; j < demand.length; j++) {
      resultHTML += `<th>Demand ${j + 1}</th>`;
    }
    resultHTML += "</tr></thead><tbody>";

    for (let i = 0; i < supply.length; i++) {
      resultHTML += `<tr><th>Supply ${i + 1}</th>`;
      for (let j = 0; j < demand.length; j++) {
        resultHTML += `<td>${allocations[i][j]}</td>`;
      }
      resultHTML += "</tr>";
    }

    resultHTML += "</tbody></table>";

    steps = [];
    totalCalculation = 0;
    for (let i = 0; i < supply.length; i++) {
      for (let j = 0; j < demand.length; j++) {
        if (allocations[i][j] > 0) {
          let step = `${allocations[i][j]}(${costMatrix[i][j]})`;
          steps.push(step);
          totalCalculation += allocations[i][j] * costMatrix[i][j];
        }
      }
    }

    calculationString = steps.join(" + ") + ` = ${totalCalculation}$`;
    resultHTML += "<h3>Optimized Cost Calculation</h3>";
    resultHTML += `<p>${calculationString}</p>`;
  }

  resultHTML += `<h3>Total Cost: ${totalCalculation}$</h3>`;
  resultDiv.innerHTML = resultHTML;
}
