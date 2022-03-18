bots = {};

setInterval(()=> {
    /* let teste = document.getElementsByClassName('contact')
    Array.prototype.forEach.call(teste, (item) => {
            let te = item.getElementsByClassName('mw-100')
            console.log(te[0].textContent)
    }) */

    createBotList().then(() => createGroups())
/*     let contactList = document.getElementsByClassName('contact-list');
    console.log(contactList)
    contactList[0].innerHTML += '<h1> KKKKKKKKKKKKKKKKK</h1>'
    console.log('ok') */
}, 10000);

async function createBotList() {
    return new Promise((resolve) => {
        let botList = document.getElementsByClassName('contact-list')[0].children;
        for (bot of botList) {
            let botName = bot.getElementsByClassName('mw-100')[0].textContent;
            var matches = botName.match(/\[(.*?)\]/);
    
            if (matches) {
                botName = matches[1];
            }
    
            if (bots[botName]!== undefined) {
                bots[botName].push({bot: bot})
            } else {
                bots[botName] = [{bot: bot}]
            }
            bot.classList.add('hidden')
        }
        resolve(true)
        console.log(bots)
    })
}

function createGroups() {
    let contactList = document.getElementsByClassName('contact-list');
    for (let botName in bots) {
        contactList[0].innerHTML += groupCard(botName, botName.length);
    }
    
    console.log('works')
}

function groupCard(name, skillsCounter) {
    return (
    `<contact>
        <div class="contact animated fadeIn">
        <ng-include src="'ContactBody.html'">
            <div class="card card-background flex justify-center flex-column relative mt0 card-content tc">
                <div class="contact-name white-text flex flex-column items-center justify-center">
                    <div class="mb3">
                        
                    </div>
                    <span class="mw-100">${name}</span>
                    <span>${skillsCounter} skills</span>
                </div>
            </div>
        </ng-include>
        </div>
    </contact>`
    )
}
