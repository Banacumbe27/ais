container.classList.add("analysis-box");
const navbar=document.querySelector(".topbar");
const sample_data={
    precipitation:1203.77,
    humidity:78.50136986,
    max_temp:31.83556164,
    min_temp:23.72783562,
    mean_temp:27.26131507,
    wind_speed:2.393561644,
    population_density:593.1,
    urbanization_rate:29.01718672
}

const sample_data3 = {
    Precipitation: 1523.42,
    Humidity: 81.17210959,
    Max_Temp: 31.78120548,
    Min_Temp: 24.02545205,
    Mean_Temp: 27.39627397,
    Wind_Speed: 2.218657534,
    Population_Density: 552.5,
    Urbanization_Rate: 30.98966329
};
const sample_data2 = {
    Precipitation: 1203.77,
    Humidity: 78.50,
    Max_Temp: 31.83,
    Min_Temp: 23.72,
    Mean_Temp: 27.26,
    Wind_Speed: 2.39,
    Population_Density: 593.1, 
    Urbanization_Rate: 29.01 
};
const sample_data4 = {
    Precipitation: 2036.86,
    Humidity: 83.23540984,
    Max_Temp: 28.82584699,
    Min_Temp: 20.38669399,
    Mean_Temp: 23.98155738,
    Wind_Speed: 0.308852459,
    Population_Density: 148.9,
    Urbanization_Rate: 26.09175971

};
const data_structure={
input_classes:[
     ["Min_Temp",["°C","°F","K"],"number","Minimum Temperature"],
    ["Max_Temp",["°C","°F","K"],"number","Maximum Temperature"],
    ["Mean_Temp",["°C","°F","K"],"number","Mean Temperature"],
    ["Precipitation",["mm"],"number","Rainfall Amount"],
    ["Humidity",["%"],"number","Relative Humidity"],
    ["Wind_Speed",["m/s"],"number","Wind Speed"],
    ["Population_Density",["p/km²"],"number","Population Density"],
    ["Urbanization_Rate",["%"],"number","Urbanization Rate"],
]
};

function createElementClass(type,classnames=""){
    classnames=classnames.split(" ");
    const ele=document.createElement(type);
    classnames.forEach(obj_classname=>{if(obj_classname)ele.classList.add(obj_classname)});

    return ele;
}

const process=createElementClass("div","row analysis-container");
const input_column=createElementClass("div","column input-panel");

// Add panel title
const panelTitle = createElementClass("div", "input-panel-title");
panelTitle.textContent = "Environmental Parameters";
input_column.appendChild(panelTitle);

data_structure.input_classes.forEach(input_class=>{
const input_row=createElementClass("div","row input-row");
const label=createElementClass('div')
label.classList.add("label", "input-label");
label.textContent=input_class[0].replace("_", " ")+":";
label.title = input_class[3]; // Tooltip with description
const input=createElementClass("input",input_class[0].toLowerCase());
input.type=input_class[2];
input.placeholder = "Enter value...";
const select=createElementClass("select",`${input_class[0].toLowerCase()}-unit`);

input_class[1].forEach(unit=>{
const option=createElementClass("option","");
option.textContent=unit;
select.appendChild(option);
});

input_row.appendChild(label);
input_row.appendChild(input);
input_row.appendChild(select);
input_column.appendChild(input_row);
});

const convert_button=createElementClass("input","convert-button");
convert_button.type="button";
convert_button.value="ANALYZE";
convert_button.onclick=()=>{
    collect_data()
}

// Result Panel
const resultPanel = createElementClass("div", "column result-panel");
const resultTitle = createElementClass("div", "input-panel-title");
resultTitle.textContent = "Analysis Result";
resultPanel.appendChild(resultTitle);

const prediction=createElementClass("div","prediction");
prediction.innerHTML = `<span class="prediction-label">Risk Level</span><span class="prediction-value">AWAITING DATA</span>`;

resultPanel.appendChild(prediction);

// Status indicator
const statusIndicator = createElementClass("div", "status-indicator");
statusIndicator.innerHTML = `<span class="status-dot"></span><span class="status-text">System Ready</span>`;
resultPanel.appendChild(statusIndicator);

process.appendChild(input_column);
process.appendChild(convert_button);
process.appendChild(resultPanel);

process.style.marginTop=`${navbar ? navbar.clientHeight : 80}px`

container.appendChild(process);

async function collect_data(){
    // Show loading state
    prediction.innerHTML = `<span class="prediction-label">Processing</span><span class="prediction-value loading">ANALYZING...</span>`;
    prediction.className = "prediction";
    statusIndicator.innerHTML = `<span class="status-dot processing"></span><span class="status-text">Processing satellite data...</span>`;
    
    let vals={};
    data_structure.input_classes.forEach(input_class=>{
    const inputVal = document.querySelector(`.${input_class[0].toLowerCase()}`).value;
    vals[input_class[0].toLowerCase()] = inputVal ? JSON.parse(inputVal) : 0;
    });
    console.log(vals);
    
    try {
        let result = await fetch_model(vals);
        console.log(result);
        
        // Parse risk percentage
        const riskValue = parseFloat(result.risk_percentage);
        let riskClass = "low-risk";
        let riskText = "LOW RISK";
        
        if (riskValue > 70) {
            riskClass = "high-risk";
            riskText = "HIGH RISK";
        } else if (riskValue > 40) {
            riskClass = "medium-risk";
            riskText = "MEDIUM RISK";
        }
        
        prediction.innerHTML = `<span class="prediction-label">${riskText}</span><span class="prediction-value">${result.risk_percentage}</span>`;
        prediction.className = `prediction ${riskClass}`;
        statusIndicator.innerHTML = `<span class="status-dot success"></span><span class="status-text">Analysis Complete</span>`;
        
    } catch (error) {
        prediction.innerHTML = `<span class="prediction-label">Error</span><span class="prediction-value">CONNECTION FAILED</span>`;
        prediction.className = "prediction high-risk";
        statusIndicator.innerHTML = `<span class="status-dot error"></span><span class="status-text">Server unreachable</span>`;
    }
}
const backend_url="https://nonartistical-retta-untaloned.ngrok-free.dev/predict";
async function fetch_model(data){
    return await fetch(backend_url,{
        method:"post",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(data)})
        .then(res=>res.json()).then(dat=>dat)
    }

