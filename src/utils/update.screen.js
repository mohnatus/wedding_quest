const hide = el => {
  el.style.display = "none";
}

const show = el => {
  el.style.display = "";
}

let updateScreen = (() => {
  let screen = document.querySelector(".game-screen");
  let pic = screen.querySelector(".screen__pic");
  let img = pic.querySelector(".screen__img");
  let title = screen.querySelector(".screen__title");
  let text = screen.querySelector(".screen__text");
  let next = screen.querySelector(".screen__next");
  let nextText = next.querySelector("b");

  
  const reset = () => {
    show(pic);
    show(img);
    show(title);
    show(text);
    pic.removeAttribute("data-map");
    screen.removeAttribute("data-class");
  }

  return (data, nextCallback) => {
    if (!data) {
      hide(screen);
      return;
    }

    reset();

    screen.setAttribute("data-class", data.class);

    if (data.img) {
      img.src = data.img;
    } else {
      hide(img);
    }

    if (data.map) {
      pic.setAttribute("data-map", data.map);
    } else if (!data.img) {
      hide(pic);
    }

    if (data.title) {
      title.innerHTML = data.title;
    } else {
      hide(title);
    }

    if (data.text) {
      text.innerHTML = data.text;
    } else {
      hide(text);
    }

    if (data.next) {
      nextText.textContent = data.next;
    } else {
      nextText.textContent = "Дальше";
    }

    next.onclick = () => nextCallback();
    
    show(screen);
  }
})();

export default updateScreen;