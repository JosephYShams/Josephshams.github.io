app_data = {
    "html_folder": "../html/",
    "data_folder": "../data/",
    "max_purchases": 1,
    "device_list": {},
    "purchases": []
}

var devices_capabilities = [];

purchase_history_length = false;

device_for_final_page = "smarttv";
app_data_path = "../data/app_data.json";

function LoadHTML(page, el_id) {
    fetch(`${app_data["html"]}${page}.html`)
        .then(response => response.text())
        .then(text => {
            if (el_id) {
                document.getElementById(el_id).style.display = 'block';
                document.getElementById(el_id).innerHTML = text;
            }
        });
}

function GetGameDevices(page, el_id) {
    //fetch(`${app_data["data_folder"]}${page}.json`)
    fetch(`./static/data/${page}.json`)
    .then(response => response.json())
        .then(data => {
            app_data["device_list"] = data;
            DrawDevices(app_data["device_list"], el_id);
        })
}

function Restart() {
    if (confirm("Are you sure you want to restart? Your progress will be lost!") == true) {
        window.location.reload();
    } else {
        return;
    }
    document.getElementById("demo").innerHTML = text;
}

function UpdateDrawDevices() {

    devices = app_data["device_list"]["devices"];
    device_name_lower = "";
    if (devices.length > 0) {
        if (app_data["purchases"].length > 3 && purchase_history_length == false) {
            purchase_history_length = true;
            for (i = 0; i < devices.length; i++) {
                if (devices[i]["locked"] == true) {
                    device_name_lower = (devices[i]['id']).toLowerCase();
                    document.getElementById("unlocked_locked_devices_alert").style.display = "block";
                    document.getElementById(device_name_lower + "_tooltip_id").innerHTML = "To unlock this device, click the unlock button";
                    document.getElementById("quick_help").style.display = "none";
                }
            }
        }
    }
}

function UnlockLockedDevices() {
    devices = app_data["device_list"]["devices"];

    if (devices.length > 0) {
        for (i = 0; i < devices.length; i++) {
            if (devices[i]["locked"] == true) {
                device_name_lower = (devices[i]['id']).toLowerCase();
                document.getElementById(device_name_lower + "_purchase").disabled = false;
                document.getElementById(device_name_lower + "_lock_icon").style.display = "none";
                document.getElementById(device_name_lower + "_tooltip_id").style.display = "none";
            }
        }
    }

    document.getElementById("unlocked_locked_devices_alert").style.display = "none";
    document.getElementById("quick_help").style.display = "block";

}


function DrawDevices(data, el_id) {

    devices = data["devices"];

    if (devices.length > 0) {
        html = `<div class="w3-row-padding ">`;
        for (i = 0; i < devices.length; i++) {
            device_name_lower = (devices[i]['id']).toLowerCase();
            device_imag_path = (devices[i]['img_path']).toLowerCase();
            image = `${device_imag_path}${device_name_lower}.png`;
            html += `
                <div id="${devices[i]['id']}" class="w3-col l3 m3 w3-margin-bottom">
                `;
            if (devices[i]["locked"] == true) {
                html += `
                <div class="w3-card w3-tooltip">
                <div class="w3-container">
                    <p class="w3-center" style="font-size:1vw;"><span id="${device_name_lower}_tooltip_id" style="w3-display-topmiddle w3-hide-small" style="position:absolute;left:0;bottom:18px"class="w3-text w3-tag">To unlock this device, register the first 4 devices</span><i id="${device_name_lower}_lock_icon" class="fa fa-lock w3-padding-16"></i></p>                             
                `;

            } else if (devices[i]["locked"] == false) {
                html += `
                <div class="w3-card">
                <div class="w3-container">
                    <p class="w3-center" style="font-size:1vw;"><i id="${device_name_lower}_lock_icon" class="fa fa-lock"></i></p>                             
                `;
            }

            html += `                                
                                <h3 class="w3-center" style="font-size:1vw;">Smart ${device_name_lower}</h3>
                                <img class="center" src="${image}" alt="${device_name_lower}" style="width:85%">
                                <p><button id="${device_name_lower}_purchase" class="w3-button w3-amber w3-block" onclick="Purchase('${device_name_lower}')">Select</button>
                                </p>     
                            </div>
                        </div>
                    </div>
                `;

        }
        html += `</div>`;

        document.getElementById(el_id).style.display = 'block';
        document.getElementById(el_id).innerHTML = html;


        for (i = 0; i < devices.length; i++) {
            device_name_lower = (devices[i]['id']).toLowerCase();
            if (devices[i]["locked"] == true) {
                document.getElementById(device_name_lower + "_lock_icon").style.display = "block";
                document.getElementById(device_name_lower + "_purchase").disabled = true;
            } else if (devices[i]["locked"] == false) {
                document.getElementById(device_name_lower + "_lock_icon").style.display = "none";
                document.getElementById(device_name_lower + "_purchase").disabled = false;
            }
        }


        if (app_data['purchases'].length >= app_data['max_purchases']) {
            GameFinished();

        }
    }
}


function DisplayProgress(el_id) {
    purchases = app_data["purchases"];
    max_purchases = app_data["max_purchases"];
    progress = 0;

    if (purchases.length > 0) {
        raw_progress = (100 * purchases.length) / max_purchases;
        progress = Math.trunc(raw_progress);
    }
    if (progress > 0) {
        progress_str = `<div class="w3-container w3-grey w3-text-light-grey w3-center" style="width:${progress}%">${progress}%</div>`;
    } else {
        progress_str = `<div class="w3-container w3-light-grey w3-center">&nbsp; 0%</div>`;
    }
    document.getElementById(el_id).innerHTML = progress_str;
    return progress_str; //`<div class="w3-container w3-grey w3-text-light-grey w3-center" style="width:${progress}%">${progress}%</div>`;
}

function ShowPurchaseHistory(el_id) {
    purchases = app_data["purchases"];

    purchase_history = `<div class="w3-center" style="padding-bottom:10px">Your registered devices</div>`

    if (purchases.length > 0) {
        for (i = 0; i < app_data["max_purchases"]; i++) {
            purchase_history += `<div class="w3-col l2 m2">`;
            if (i < purchases.length) {
                purchase_history += `
                    <img class="w3-image" src="/static/img/${purchases[i]}_tn.png" alt="${purchases[i]}" style="width:100%">`;
            } else {
                purchase_history += `&nbsp;`;
            }
            purchase_history += `</div>`;
        }
    } else {
        purchase_history += `<div class="w3-col l2 m2">
        <img class="w3-image" src="./static/img/blank_tn.png" style="width:100%"></div><h3 class="w3-medium">No devices registered ...</h3>`;
    }

    if (document.getElementById(el_id)) {
        document.getElementById(el_id).innerHTML = purchase_history;
    }

    if (purchases.length < app_data["max_purchases"]) {
        for (i = 0; i < purchases.length; i++) {
            document.getElementById(purchases[i] + "_purchase").disabled = true;
        }
    } else {
        for (i = 0; i < app_data["device_list"].length; i++) {
            document.getElementById(app_data["device_list"][i]["id"]).disabled = true;
        }
        GameFinished();
    }

    DisplayProgress("progress");

    return purchase_history;
}

function GameFinished() {
    document.getElementById('device').style.display = 'none';
    document.getElementById('devices_selection').style.display = 'block';
    LoadHTML('time_out', 'available_devices');
    console.log(third_part_of_the_study);
    // console.log(document.getElementById("end_of_study"));

}

function Purchase(device_name) {

    device_name_lower = device_name.toLowerCase();
    this_device = {};

    for (i = 0; i < app_data["device_list"]['devices'].length; i++) {
        if (app_data["device_list"]['devices'][i]["id"] == device_name_lower) {
            this_device = app_data["device_list"]['devices'][i];
        }
    }

    document.getElementById('devices_selection').style.display = 'none';

    html = PurchaseDevice(this_device);
    // appendHTML = document.getElementById('device').innerHTML;

    document.getElementById('device').style.display = 'block';
    document.getElementById('device').innerHTML = html;
}

function Validate(device_id, correct, id, auto = false, mrrobot) {
    for (k = 0; k < app_data['device_list']['devices'].length; k++) {
        this_device_id = app_data['device_list']['devices'][k]['id'];
        if (this_device_id == device_id) {
            this_device_capabilities = app_data['device_list']['devices'][k]['capabilities'];
            for (l = 0; l < this_device_capabilities.length; l++) {
                d_id_correct = "correct_" + this_device_id + "_" + l;
                d_id_incorrect = "incorrect_" + this_device_id + "_" + l;
                d_id_failed = "`failedvalidate_" + this_device_id;
                d_id_help = "help_" + this_device_id + "_" + l;
                document.getElementById(d_id_correct).style.display = 'none';
                document.getElementById(d_id_incorrect).style.display = 'none';
                if (document.getElementById(d_id_failed)) {
                    document.getElementById(d_id_failed).style.display = 'none';
                }
                document.getElementById(d_id_help).style.display = 'none';

            }
        }
    }

    if (auto == true) {
        document.getElementById(correct).checked = true;
    }

    document.getElementById('purchase_device').disabled = true;

    var ele = document.getElementsByName('conf_beh_' + id);

    if (ele.value == null) {
        document.getElementById(`correct_${device_id}_${id}`).style.display = 'none';
        document.getElementById(`incorrect_${device_id}_${id}`).style.display = 'none';
        document.getElementById(`failedvalidate_${device_id}`).style.display = 'block';
        document.getElementById(`help_${device_id}_${id}`).style.display = 'none';
    }

    for (i = 0; i < ele.length; i++) {
        el = document.getElementById(ele[i].value);
        document.getElementById(ele[i].value + "_holder").style = 'color: #000';
    }
    if (mrrobot == false) {


        for (i = 0; i < ele.length; i++) {
            if (ele[i].checked) {
                el = document.getElementById(ele[i].value);
                if (el.value == correct) {
                    document.getElementById(ele[i].value + "_holder").style = 'background-color: #008000; color: #fff';
                    document.getElementById(`correct_${device_id}_${id}`).style.display = 'block';
                    document.getElementById(`incorrect_${device_id}_${id}`).style.display = 'none';
                    document.getElementById(`failedvalidate_${device_id}`).style.display = 'none';
                    document.getElementById(`help_${device_id}_${id}`).style.display = 'none';

                    document.getElementById(`validate_btn_${device_id}_${id}`).disabled = true;
                    document.getElementById('robot_' + id).disabled = true;
                } else {
                    document.getElementById(ele[i].value + "_holder").style = 'background-color: #FF0000; color: #fff';
                    document.getElementById(`correct_${device_id}_${id}`).style.display = 'none';
                    document.getElementById(`incorrect_${device_id}_${id}`).style.display = 'block';
                    document.getElementById(`failedvalidate_${device_id}`).style.display = 'none';
                    document.getElementById(`help_${device_id}_${id}`).style.display = 'none';
                }
            }
        }
    } else if (mrrobot == true) {
        document.getElementById(`correct_${device_id}_${id}`).style.display = 'none';
        document.getElementById(`incorrect_${device_id}_${id}`).style.display = 'none';
        document.getElementById(`failedvalidate_${device_id}`).style.display = 'none';
        document.getElementById(`help_${device_id}_${id}`).style.display = 'block';
    }

    l = 0;
    for (k = 0; k < app_data['device_list']['devices'].length; k++) {
        if (app_data['device_list']['devices'][k]['id'] == device_id) {
            m = 0;
            for (l = 0; l < app_data['device_list']['devices'][k]['capabilities'].length; l++) {
                if (document.getElementById('validate_btn_' + device_id + '_' + l).disabled) {
                    m++;
                }
            }
            if (m == l) {
                document.getElementById('purchase_device').disabled = false;
            }
        }
    }
}

function CancelPurchase(el_id) {
    document.getElementById('device').style.display = 'none';
    document.getElementById('devices_selection').style.display = 'block';
    ShowPurchaseHistory(el_id);
}

function PurchaseThisDevice(device, el_id) {
    app_data["purchases"].push(device);
    document.getElementById('device').style.display = 'none';
    document.getElementById('devices_selection').style.display = 'block';
    ShowPurchaseHistory(el_id);

    UpdateDrawDevices();

    // document.getElementById('rewards').innerHTML += "<span class='fa fa-star checked'></span>";
}

function PurchaseDevice(this_device) {
    device_name_lower = this_device["id"];
    current_question_error_msg = "";

    html = `
        <div class="w3-card" style="margin: 0 32px 0 32px">
        <div class="w3-row-padding">
            <div  class="w3-col l8 m8  w3-large" >
                <h4 class="w3-center w3-border-bottom">
                    <!--p>You are purchasing a Smart ${device_name_lower.toUpperCase()}</p-->
                    To purchase this Smart ${device_name_lower.toUpperCase()} you must answer the following 3 questions.
                </h4>
                <h5 class="w3-center">If you are unsure, just click the &nbsp;<i class='fa fa-question w3-indigo w3-xlarge w3-padding' aria-hidden='true' style='padding: 5px'></i> button for help. </h5>
                <h5 class="w3-center">To check your answer, click the <a class="w3-padding w3-amber" style="margin: 4px 10px 0 0; width:100px">validate</a>button next to each question.</h5> 
                
     `;

    let capabilities = this_device["capabilities"];

    for (i = 0; i < capabilities.length; i++) {
        html += `
                    <div class="w3-border w3-margin-bottom" >
                    <p class="w3-pale-yellow w3-panel w3-medium ">${capabilities[i]["statement"]}</p>
                    <div class="w3-row w3-light-gray w3-medium" style="margin-bottom: 20px">`;

        current_question_error_msg = capabilities[i]["error_message"];

        questions = capabilities[i]["questions"];
        for (j = 0; j < questions.length; j++) {
            question = questions[j]["question"];

            id_str = question.replace(/ /g, '');
            id_str = `${id_str}_${i}_${j}`;

            if (questions[j]["value"])
                validate_str = id_str;

                // here
            html += `
                        <div class="w3-light-gray w3-quarter" style="padding: 10px 0 0px 0px;">
                            <label id="${id_str}_holder" >&nbsp;&nbsp;${question}&nbsp;&nbsp;</label>
                            <input class="w3-radio" type="radio" name="conf_beh_${i}" id="${id_str}" value="${id_str}">
                        </div>`;
        }
        html += `
                    
                        <div class="w3-light-gray w3-quarter w3-right-align" style="padding-right: 10px">
                        <button id="validate_btn_${device_name_lower}_${i}" class="w3-button w3-amber" style="margin: 4px 10px 0 0; width:100px" onclick="Validate('${device_name_lower}', '${validate_str}', ${i}, auto=false, false)">validate</button>
                        <button id="robot_${i}" class="w3-button w3-indigo"
                        style="margin-top: 4px; width: 50px;" onclick="Validate('${device_name_lower}', '${validate_str}', ${i}, auto=false, true)"><i class="fa fa-question" aria-hidden="true"></i></button>
                        </div>

                    </div>
                    </div>
                    
                    `;
    }

    for (i = 0; i < capabilities.length; i++) {
        current_question_error_msg = capabilities[i]["error_message"];

        html += `
            <div style="display: none; margin-bottom:20px" id=correct_${device_name_lower}_${i}>
                <table cellpadding="10px" style="background-color: #008000;; color: #fff ">
                    <tr>
                        <td width="1%"><img src="/static/img/check.png"></td>
                        <td><p>${current_question_error_msg}</p></td>
                    </tr>
                </table>
             </div>
            
             <div style="display: none; margin-bottom:20px" id="help_${device_name_lower}_${i}">
                <table class="w3-indigo" cellpadding="10px" style="width:100%; color: #fff ">
                    <tr>
                        <td width="1%"><img src="/static/img/question.png"></td>
                        <td><p>${current_question_error_msg}</p></td>
                    </tr>
                </table>
            </div>

             <div style="display: none; margin-bottom:20px" id="failedvalidate_${device_name_lower}">
                <table cellpadding="10px" style="width:100%; padding: 5px; background-color: #ffa500;; color: #fff ">
                    <tr>
                        <td width="1%"><img src="/static/img/exclamation.png"></td>
                        <td><p style="color: #000" >You must first select an answer before validating!</p></td>
                    </tr>
                </table>
            </div>
            
            <div style="display: none; margin-bottom:20px" id="incorrect_${device_name_lower}_${i}" >
            <table cellpadding="10px" style="background-color: #FF0000; color: #fff">
                <tr>
                    <td width="1%"><img src="/static/img/cross.png"></td>
                    <td><p>${current_question_error_msg}</p></td>
                </tr>
            </table>
            </div>`;
    }

    purchase_history = ShowPurchaseHistory('purchase_history');
    html += `
    
            </div>
            
            <div class="w3-col m4 m4 ">
            <div class="w3-row-padding w3-panel w3-topbar w3-bottombar w3-blue-grey w3-light-grey">${purchase_history}</div>

            <div class="w3-row" style="padding-bottom: 10px;">
                    <div class="w3-col w3-container m4">
                        <h5 class="w3-center">Game progress (%)</h5>
                    </div>
                    <div class="w3-col w3-container m8">
                        <div class="w3-section w3-light-grey" style="border: 1px solid #c0c0c0">${DisplayProgress("progress")}
                        </div>
                    </div>
                </div>
                <div class="w3-center">
                    <img class="w3-hide-medium w3-hide-small" src="/static/img/${device_name_lower}.png" alt="${device_name_lower}" style="width:70%">
                </div>
            
                <div class="w3-center">
                    <button class="w3-button w3-padding-small w3-red" style="margin: 0 40px 10px 0; width:250px"
                        onclick="CancelPurchase()">cancel</button>
                </div>
                <div class="w3-center">
                    <button id="purchase_device" class="w3-button w3-padding-small w3-green" style="margin: 0 40px 10px 0; width:250px"
                    onclick="PurchaseThisDevice('${device_name_lower}', 'purchase_history')" disabled>Register device</button>
                </div>

                <!--div class="w3-row-padding w3-panel w3-topbar w3-bottombar w3-blue-grey w3-light-grey">${purchase_history}</div-->

                </div>
            </div>
        </div>
    </div>        
        
        `;

    return html;
}

function ShowDeviceFinalPage(evt, dev_name) {
    var i, x, tablinks;
    x = document.getElementsByClassName("smartdevices");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < x.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" w3-grey", "");
    }
    document.getElementById(dev_name).style.display = "block";
    evt.currentTarget.className += " w3-grey";
    device_for_final_page = dev_name;
}

function menu() {
    if (document.getElementById("menu").style.display == 'block') {
        document.getElementById("menu").style.display = "none";
        document.getElementById("tips").style.display = "none";
    } else {
        LoadHTML('help', 'menu_help')
        document.getElementById("menu").style.display = "block";
        document.getElementById("tips").style.display = "none";
    }
}

function controlmenu() {
    if (document.getElementById("control_help").style.display == 'block') {
        document.getElementById("control_help").style.display = "none";
    } else {
        LoadHTML('help', 'control_help')
        document.getElementById("control_help").style.display = "none";
    }
}

function tipsmenu() {
    if (document.getElementById("tips").style.display == 'block') {
        document.getElementById("tips").style.display = "none";
        document.getElementById("menu").style.display = "none";
    } else {
        LoadHTML('tips', 'tips_menu')
        document.getElementById("tips").style.display = "block";
        document.getElementById("menu").style.display = "none";
    }
}

function downloadPage() {
    let doc = new jsPDF('p', 'pt', 'a4');

    doc.addHTML(document.body, function () {
        doc.save(`${device_for_final_page}.pdf`);
    });
}

function redirectToThirdPartOfTheStudy() {

    let url = third_part_of_the_study;
    window.location.href = url;
}

function isChecked(checkbox, btn1) {
    var button = document.getElementById(btn1);

    if (checkbox.checked === true) {
        button.disabled = "";
    } else {
        button.disabled = "disabled";
    }
}