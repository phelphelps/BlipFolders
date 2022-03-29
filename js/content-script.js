let bots = {};
let teste;
let sideBar;
let sideBarContent;
let routerBtn;

setInterval(() => console.log("o"), 4000);
function checkURLchange() {
  console.log(window.location.href);
  if (window.location.href != oldURL) {
    console.log(window.location.href);
    initExtension();
    oldURL = window.location.href;
  }
}

var oldURL = window.location.href;
setInterval(checkURLchange, 1000);

const check = setInterval(() => {
  const contactsListItems = document.getElementsByTagName("contact");
  if (contactsListItems.length > 0) {
    const mainWrapper = document.getElementsByTagName("ui-view");
    setTimeout(() => {
      mainWrapper[0].innerHTML += `
    <div class="side-bar flex-column hidden">
      <div class="sidebar-content-header background-text-dark-5 bp-c-white ph5 pt2">
        <div class="sidebar-helper-header">
            <input class="bp-c-white w-100 sidebar-title" type="text" value="Blip Folders" readonly>
            <div class="sidebar-helper-header__actions">
                <span>
                    <i class="icon-close cursor-pointer" id="close-menu"></i>
                </span>
            </div>
        </div>
      </div>  
      <div class="sidebar-content-body">
        <div class="sidebar-inner-content pa5">
            <div class="flex flex-column">
                <span class="lh-solid w-100 bp-fs-5 fw7 ttu pb1" id="folder-title">Pasta de skills {nome do grupo}</span>
                <form class="flex" id="btn-container-blipfolders"></form>
                <contact-list id="side-bar-contact-list"></contact-list>
                <div class="bp-divider-h bp-divider w-100 mv4"></div>
            </div>
        </div>
      </div>
    </div>`;
    }, 2000);
    clearInterval(check);
  }
}, 100);

function initExtension() {
  createBotList().then(() => {
    document
      .getElementById("close-menu")
      .addEventListener("click", () => toggle());
    createGroups();
  });
}

async function createBotList() {
  return new Promise((resolve) => {
    let botList = document.getElementsByClassName("contact-list")[0].children;
    for (bot of botList) {
      let botName = bot.getElementsByClassName("mw-100")[0].textContent;
      let botImage = bot.getElementsByClassName("icon-avatar")[0].src;
      const botType = bot.getElementsByTagName("small")[0].innerHTML;
      var matches = botName.match(/\[(.*?)\]/);

      if (matches) {
        botName = matches[1];
        const botClone = bot.cloneNode(true);
        botClone.addEventListener("click", () =>
          document.getElementById("close-menu").click()
        );
        if (bots[botName] !== undefined) {
          if (botType === "Roteador" && bots[botName].roteador === "") {
            bots[botName].roteador = getBotURL(bot);
          } else {
            bots[botName].allBots.push(botClone);
            if (botImage) {
              bots[botName].image = botImage;
            }
          }
        } else {
          if (botType === "Roteador") {
            bots[botName] = {
              allBots: [],
              image: "",
              id: guid,
              roteador: getBotURL(bot),
            };
          }
          const guid = guidGenerator();
          bots[botName] = {
            allBots: [botClone],
            image: botImage,
            id: guid,
            roteador: "",
          };
          bot.classList.add(guid);
        }
        bot.classList.add("hidden");
      }
    }
    console.log(bots);
    resolve(true);
  });
}

function getBotURL(botElement) {
  const linkElement = botElement.getElementsByTagName("a");
  return linkElement[0].href;
}

function createGroups() {
  let contactList = document.getElementsByClassName("contact-list");
  for (let botName in bots) {
    contactList[0].innerHTML += groupCard(
      botName,
      bots[botName].allBots.length,
      bots[botName].image,
      bots[botName].id
    );
    setTimeout(() => {
      document
        .getElementById(bots[botName].id)
        .addEventListener("click", () => toggle(bots[botName], botName));
    }, 100);
  }
}

function getElementIndex(id) {
  let contactList = document.getElementsByClassName("contact-list");
  const botNodeArray = Array.from(contactList[0].children);
  const index = botNodeArray.findIndex((item) => item.id === id);
  return index;
}

function guidGenerator() {
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (
    S4() +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  );
}

function openBot(link) {
  window.open(link, "_blank").focus();
}

function toggle(botGroup, botName) {
  routerLink = "";
  sideBarContent = document.getElementById("side-bar-contact-list");
  sideBar = document.getElementsByClassName("side-bar")[0];
  const title = document.getElementById("folder-title");
  if (!botGroup) {
    closeFolder(sideBar, sideBarContent);
    return;
  }

  if (bots[botName].roteador) {
    routerBtn = document.getElementById("router-btn");
    addButtons(bots[botName]);
  }

  title.innerHTML = `Pasta de skills referentes à: ${botName}`;
  if (sideBar.className.includes("hidden")) {
    sideBar.classList.remove("hidden");
    sideBar.classList.add("fade-in-right");
    botGroup.allBots.forEach((bot) => {
      sideBarContent.appendChild(bot);
    });
  } else {
    closeFolder(sideBar, sideBarContent);
  }
}

function closeFolder() {
  sideBarContent.innerHTML = "";
  sideBar.classList.add("hidden");
  sideBar.classList.remove("fade-in-right");
}

function openAllBots(bots) {
  for (bot in bots) {
    const link = getBotURL(bot);
    openBot(link);
  }
}

function addButtons(botGroup) {
  console.log(botGroup, botGroup.roteador);
  const container = document.getElementById("btn-container-blipfolders");
  container.innerHTML = `
    <button formaction="${botGroup.roteador}" class="bp-btn button-folders bp-btn--bot bp-btn--rounded mb4">Acessar roteador</button>
    <button class="bp-btn button-folders bp-btn--bot bp-btn--rounded mb4" type="button">coming soon ;)</button>`;
  /* <button formaction="openAllBots(${botGroup.allBots})" class="bp-btn button-folders bp-btn--bot bp-btn--rounded mb4">Abrir todas skills</button> */
}

function groupCard(name, skillsCounter, imageURL, id) {
  return `<contact id="${id}" class="pointer-cursor">
        <div class="contact animated fadeIn">
        <ng-include src="'ContactBody.html'">
            <div class="card card-background flex justify-center flex-column relative mt0 card-content tc">
                <div class="contact-name white-text flex flex-column items-center justify-center">
                <div class="mb3">
                <img class="icon icon-avatar round icon-m" src="${imageURL}" />
            </div>
                    <span class="mw-100">${name}</span>
                    <span>${skillsCounter} skills</span>
                </div>
            </div>
        </ng-include>
        </div>
    </contact>`;
}
