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

  const initTask = (data, onWin) => {
    if (data.task === "word") {
      let input = document.createElement('input');
      input.type = "text";
      input.className = "input";

      input.oninput = (e) => {
        let value = input.value.toLowerCase();
        if (data.answer.indexOf(value) !== -1) {
          input.classList.add("success");
          input.disabled = true;
          onWin();
        }
      }

      text.appendChild(input);
    } else if (data.task === "choise") {

      let els = [];
      data.variants.forEach(variant => {
        let el = document.createElement('button');
        el.type = "button";
        el.className = "variant";
        el.textContent = variant.text;

        let message = document.createElement('div');
        message.innerHTML = variant.message;
       
        message.className = "message";

        els.push(el);
        el.onclick = (e) => {
          if (variant.exit) {
            els.forEach(b => b.disabled = true);
            el.classList.add("success");
            onWin();
          } else {
            el.classList.add("error");
            el.disabled = true;
          }
        }

        text.appendChild(el);
        text.appendChild(message);
        
      })
      show(text);
    }
  }
  
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

    if (data.finish) {
      document.querySelector('.game').style.display = "none";
      document.querySelector('.quest-finish').style.display = "block";

      window.points = Math.floor(Math.max(window.points, 2200));

      document.querySelector('[data-points]').textContent = window.points;

      let prices = document.querySelectorAll('[data-price]');

      prices.forEach(el => {
        let price = parseInt(el.dataset.price);
        if (price > window.points) el.disabled = true;
      })

      document.addEventListener("click", e => {
        if (e.target.hasAttribute('data-price')) {
          let price = parseInt(e.target.dataset.price);
          if (price <= window.points) {
            window.points -= price;
            document.querySelector('[data-points]').textContent = window.points;

            prices.forEach(el => {
              let price = parseInt(el.dataset.price);
              if (price > window.points) el.disabled = true;
            })
          }
          
        }
      })
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

    if (data.task) {
      next.disabled = true;

      initTask(data, () => {
        next.disabled = false;
      })
    }

    next.onclick = () => nextCallback();
    
    show(screen);
  }
})();

export default updateScreen;