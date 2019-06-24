let gDataProjects;
let gDataIssues;
let gDataUsers;
let loggedUserId = JSON.parse(localStorage.getItem("loggedUser"));
let watchedIssue;
let gInputs = {
    gContainerOne: document.getElementById("g-container1"),
    gContainerTwo: document.querySelector(".g-container2"),
    gFirstDiv: document.querySelector(".g-first"),
    gSecondDiv: document.querySelector(".g-second"),
    gThirdDiv: document.querySelector(".g-third"),
    gFourth: document.querySelector(".g-fourth")
}
gInputs.gContainerTwo.style.display = "block";
//populate project div 
function gPopulateStaticProjectPart(element){
    return element.innerHTML += `
    <div class="g-projects g-header">Projects</div>
    `
}
function gPopulateProjects(element,data){
    element.innerHTML += `
            <div class="g-projects-box" id="${data.id}">${data.projectName}</div> 
    `
    };
function gGenerateTable(data){
    gPopulateStaticProjectPart(gInputs.gFirstDiv);
        for(let weth of data){
            gPopulateProjects(gInputs.gFirstDiv,weth);
        }
    }
    //populate wathed issue div
function gPopulateStaticIssueParts(element){
return element.innerHTML += 
`
<div class="g-issues">
        <div class="g-header">Watched Issues</div>
        <div class="g-watched-header g-watched-header-title">
                <div>Key</div>
                <div>Summary</div>
                <div>Status</div>
        </div>

</div>
`
}
function gPopulateIssuesOneRow(element,data){

    element.innerHTML += `
        <div class="g-watched-header g-watched-header-data" id="${data.project}">
                <div id="${data.project}" title="${data.id}">${data.id}</div>
                <div id="${data.project}" title="${data.id}">${data.summary}</div>
                <div id="${data.project}" title="${data.id}">${data.status}</div>
        </div>
    `
}
function gGenerateTable1(data,users){
    //find logged user
    let findUser = users.find(user => user.id === loggedUserId);
    gPopulateStaticIssueParts(gInputs.gSecondDiv);
    //find array of watched issues
    if(findUser.watched_issues.length !== 0){
        for(var issue of findUser.watched_issues){
            for(let weth of data){
                if(weth.id === issue){
                    gPopulateIssuesOneRow(gInputs.gSecondDiv,weth);
                }
            }
           
    }
}

}
//populate assigne div 
function gPopulateStaticAssignePart(element,findProject,findUser){
    //find user
    let user = findUser.find(user => user.id === loggedUserId);
    element.innerHTML += 
    `
    <div class="g-assign">
    <div class="g-header">Assigned to Me</div>
</div>
    `
    //find if user have assigned issues
    if(user.assigned_issues.length !== 0){
        let filterArr = findProject.filter(project => user.assigned_issues.includes(project.id));
        for(var project of filterArr){
            element.innerHTML += 
                `
                <div class="g-assign-body">${project.projectName}</div>
                `
        }
    }else{
        element.innerHTML +=
        `
                <div class="g-assign-body">You currently have no Issues assigned to you.Enjoy
                        your day.</div>
        `
    }
}
function gPopulateHeaderSection(findIssue,findProject){
    gInputs.gContainerTwo.innerHTML += `
    <header class="g-project-header">                  
    <h1 id="g-selected-header1">${findProject.projectName}</h1>
    <h3 id="g-selected-header2">${findIssue.summary}</h3>
    </header>
    `
}
function gPopulateDescriptionSection(findIssue){
    gInputs.gContainerTwo.innerHTML +=
    `
        <table class="g-table">
            <tr>
                <td>Type: </td>
                <td><i class="fas fa-bug"></i> ${findIssue.issue_type}</td>
            </tr>
            <tr>
                <td>Priority: </td>
                <td><i class="fas fa-ban"></i> ${findIssue.priority}</td>
            </tr>
            <tr>
                <td>Affects Version/s: </td>
                <td>${findIssue.affectedVersion}</td>
            </tr>
            <tr>
                <td>Component/s: </td>
                <td>${findIssue.component}</td>
            </tr>
            <tr>
                <td>Status: </td>
                <td><input type="button" value="${findIssue.status}" class="g-dropbtn g-dropbtn1"></td>
            </tr>
            <tr>
                <td>Fix Version: </td>
                <td>${findIssue.fixVersion}</td>
            </tr>
        </table>
    `
}
function gPopulatePeopleSection(findReporter,findUser,findIssue,user){
    let watchersCount = findIssue.watchers.length;
    //user who is loged 
    let assigneUser = user.find(userId => userId.id === loggedUserId);
    //user who is assigne in the moment when logged user go to the iisue page
    let assignedUser = findUser.firstName + " " +  findUser.lastName;
    gInputs.gContainerTwo.innerHTML +=
    `
    <table class="g-table">
        <tr>
            <td></td>
            <td><a class="g-link" id="assigne">Assigne to me</a></td>
        </tr>
        <tr>
            <td>Assignee: </td>
            <td id="full-name"><i class="fas fa-check-double"></i> ${assignedUser}</td>
        </tr>
        <tr>
            <td>Reporter:</td>
            <td id="reporter"><i class="fas fa-user"></i> ${findReporter.firstName} ${findReporter.lastName}</td>
        </tr>
        <tr>
            <td>Watchers:</td>
            <td><input type="button" value="${watchersCount}" class="g-dropbtn g-dropbtn2"> <a class="g-link" id="stop-watch"> Stop watching this
            issue</a></td>
        </tr>
        </table>
    `
    gInputs.gContainerTwo.addEventListener("click",function(e){
        if(e.target.id === "assigne"){
            assigneToMe(user,findIssue,findUser);
            document.getElementById("assigne").disabled = true;
            document.getElementById("assigne").style.visibility="hidden";
            assignedUser = assigneUser.firstName + " " + assigneUser.lastName;
            document.getElementById("full-name").innerHTML = `
            <i class="fas fa-check-double"></i> ${assignedUser}
            `;
            document.getElementById("reporter").innerHTML = 
            `
            <i class="fas fa-user"></i> ${assignedUser}
            `
        }else if(e.target.id === "stop-watch"){
            stopWatchingIssue(user,findIssue);
            document.querySelector(".g-dropbtn2").value = `${watchersCount -1}`;
            document.getElementById("stop-watch").disabled = true;
            document.getElementById("stop-watch").style.visibility="hidden";
        }
    });
};
function assigneToMe(user,issue,findUser){
    //find index of the user who was assigned 
    let index = findUser.assigned_issues.indexOf(issue.id);
    //find loged user
    let assigneUser = user.find(userId => userId.id === loggedUserId);
    if(!(assigneUser.assigned_issues.includes(issue.id))){
        assigneUser.assigned_issues.push(issue.id);
        findUser.assigned_issues.splice(index,1);
        issue.assignee = assigneUser.id;
        issue.reporter = assigneUser.id;
    }
}
function stopWatchingIssue(user,issue){
    //find logged user
    let assigneUser = user.find(userId => userId.id === loggedUserId);
    //find index of watched issue
    let index = assigneUser.watched_issues.indexOf(issue.id);
    //find index of user in array of watched issue
    let indexOfWatcher = issue.watchers.indexOf(assigneUser.id)
    if(assigneUser.watched_issues.includes(issue.id)){
        assigneUser.watched_issues.splice(index,1);
        issue.watchers.splice(indexOfWatcher,1);
    }
}
function gPopulateDescription(findIssue){
    gInputs.gContainerTwo.innerHTML +=
    `
    <div class="g-project-description">
            <h3 class="g-header-description">Description</h3>
            <div class="g-body-description">${findIssue.description}</div>
    </div>
    `
}
function gPopulateDates(findIssue,findProject){
    gInputs.gContainerTwo.innerHTML +=
    `
    <div class="g-project-details">
            <table class="g-table">
            <tr>
                <td>Created Date: </td>
                <td><em>${findIssue.dueDate}</em></td>
            </tr>
            <tr>
                <td>Due Date:</td>
                <td><em>${findProject.dueDate}</em></td>
            </tr>
        </table>
    <div class="g-dates">
    `
}
function gPopulateCommentArea(findCommentator,findUser){
    let userName = findUser.find(user => user.id === loggedUserId);
    let gCommentDiv = document.createElement("div");
    gInputs.gContainerTwo.appendChild(gCommentDiv);
    gCommentDiv.setAttribute("class","g-comment-part");
    let gHeaderThree = document.createElement("h3");
    gCommentDiv.appendChild(gHeaderThree);
    gHeaderThree.setAttribute("class","g-header-description");
    gHeaderThree.innerHTML = "Comments";
    let gTextArea = document.createElement("div");
    gCommentDiv.appendChild(gTextArea);
    gTextArea.setAttribute("class","g-text-area");
    let gCommentArea = document.createElement("div");
    gInputs.gContainerTwo.appendChild(gCommentArea);
    let gParagraph = document.createElement("p");
    gCommentArea.appendChild(gParagraph);
    gParagraph.setAttribute("class","g-paragraph");
    gParagraph.innerHTML += `<img src="${userName.image}"/> ${userName.firstName} ${userName.lastName}`
    let gTextBtn = document.createElement("input");
    gParagraph.appendChild(gTextBtn);
    gTextBtn.setAttribute("class","g-text-btn");
    let gSubmitBtn = document.createElement("button");
    gParagraph.appendChild(gSubmitBtn);
    gSubmitBtn.setAttribute("class","g-dropbtn g-dropbtn1");
    gSubmitBtn.innerHTML = "Comment";
    if(findCommentator!==null){
        for(var comment of findCommentator){
            //find id of commentator in users json to get full name
            let findUserId = findUser.filter(id => id.id === comment.userID);
            for(var id of findUserId){
                gTextArea.innerHTML += `
                <p class="g-paragraph"><i class="fas fa-user"></i> <span class="g-comments-text"><span class="g-full-name"> ${id.firstName} ${id.lastName} :</span> ${comment.c}</span></p>
                `
            }
        }
    } 
    gSubmitBtn.addEventListener("click",function(){
        let gComment = gTextBtn.value;
        let user = gDataUsers.find(user => user.id === loggedUserId);
        if(gComment !== "" && gComment !== null){
            gTextArea.innerHTML += `
            <p class="g-paragraph"><img src="${user.image}"/> <span class="g-comments-text"><span class="g-full-name">${user.firstName} ${user.lastName}:</span> ${gComment}</span></p>
            `
            findCommentator.push({UserID: user.id,c: gComment});
        }
        gTextBtn.value = "";
        console.log(findCommentator)
    });   
};
gInputs.gFirstDiv.addEventListener("click",function(e){
    console.log(e.target);
    if(e.target.id !== undefined && e.target.id !== null && e.target.id !== "" && e.target.id.length !== 0){
        gInputs.gContainerOne.style.display = "none";
        let findProject = gDataProjects.find(project => project.id === e.target.id);
        localStorage.setItem("viewProject", JSON.stringify(findProject.id));
        window.open("../Bobi/index.html", "_self");
    }
})
gInputs.gSecondDiv.addEventListener("click",function(e){
    if(e.target.id !== undefined && e.target.id !== null && e.target.id !== "" && e.target.id.length !== 0){
        gInputs.gContainerOne.style.display = "none";
        gInputs.gContainerTwo.style.display = "block";
        let findIssue = gDataIssues.filter(issue => issue.project === e.target.id)
        .find(issue => issue.id === e.target.title);
        console.log(findIssue);
        let findProject = gDataProjects.find(project => project.id === e.target.id);
        console.log(findProject);
        let findUser = gDataUsers.find(user => user.id === findIssue.assignee);
        console.log(findUser);
        let findReporter = gDataUsers.find(project => project.id === findIssue.reporter)
        console.log(findReporter)
        let findCommentator = findIssue.comments;
        console.log(findCommentator)
        gPopulateHeaderSection(findIssue,findProject);
        gPopulateDescriptionSection(findIssue);
        gPopulatePeopleSection(findReporter,findUser,findIssue,gDataUsers);
        gPopulateDescription(findIssue);
        gPopulateDates(findIssue,findProject);
        gPopulateCommentArea(findCommentator,gDataUsers);
    }
})
async function gGetData() {
    try {
        let result = await fetch("https://raw.githubusercontent.com/pm-project-frontend/jsons/master/projects.json");
        let result1 = await fetch("https://raw.githubusercontent.com/pm-project-frontend/jsons/master/issues.json");
        let result2 = await fetch("https://raw.githubusercontent.com/pm-project-frontend/jsons/master/users.json");
        gDataProjects = await result.json();
        gDataIssues = await result1.json();
        gDataUsers = await result2.json();
        console.log(gDataUsers);
        console.log(gDataIssues);
        console.log(gDataProjects)
        gGenerateTable(gDataProjects);
        gGenerateTable1(gDataIssues,gDataUsers);
        gPopulateStaticAssignePart(gInputs.gThirdDiv,gDataProjects,gDataUsers);
    } catch (error) {
        throw new Error("Error!!!!")
    }
}
gGetData();