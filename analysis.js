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
     ["Min_Temp",["C","F","K"],"number"],
    ["Max_Temp",["C","F","K"],"number"],
    ["Mean_Temp",["C","F","K"],"number"],
    ["Precipitation",["mm"],"number"],
    ["Humidity",["%"],"number"],
    ["Wind_Speed",["m/s"],"number"],
    ["Population_Density",["x10p"],"number"],
    ["Urbanization_Rate",["%"],"number"],
]
};

function createElementClass(type,classnames=""){
    classnames=classnames.split(" ");
    const ele=document.createElement(type);
    classnames.forEach(obj_classname=>{if(obj_classname)ele.classList.add(obj_classname)});

    return ele;
}

const process=createElementClass("div","row");
const input_column=createElementClass("div","column");
data_structure.input_classes.forEach(input_class=>{
const input_row=createElementClass("div","row");
const label=createElementClass('div')
label.classList.add("label");
label.textContent=input_class[0]+":";
const input=createElementClass("input",input_class[0].toLowerCase());
input.type=input_class[2];
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
convert_button.value="→";
convert_button.onclick=()=>{
    collect_data()
}
const prediction=createElementClass("div","prediction");
prediction.textContent="Disease:???";

process.appendChild(input_column);
process.appendChild(convert_button);
process.appendChild(prediction);
prediction.style.marginTop=`${(document.body.clientHeight/4)}px`;

process.style.marginTop=`${navbar.clientHeight}px`

container.appendChild(process);

async function collect_data(){
    let vals={};
    data_structure.input_classes.forEach(input_class=>{
    vals[input_class[0]]=JSON.parse(document.querySelector(`.${input_class[0].toLowerCase()}`).value);
    });
    let result=await fetch_model(vals);
    console.log(result.risk_percentage);
    prediction.textContent=`Disease:${result.risk_percentage}`;
}
const backend_url="https://phuongvu-x99.tail17da98.ts.net/predict";
async function fetch_model(data){
    return await fetch(backend_url,{
        method:"post",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(data)})
        .then(res=>res.json()).then(dat=>dat)
    }

