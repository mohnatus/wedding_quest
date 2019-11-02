import Dispatcher from "events-dispatch";

/**
 * Intersector
 * @class
 * @description определяет пересечение объектов
 */
class Intersector {
  /**
   * Определяет пересечение объектов
   * @param {HTMLElement} obj1 первый объект
   * @param {HTMLElement} obj2 второй объект
   * @param {Number} [offset] минимальное перекрытие одного объекта другим
   * @returns {Boolean}
   */
  check(obj1, obj2, offset = 0) {
    if (obj1.removed || obj2.removed) {
      clearInterval(this.timer);
      return;
    }

    let coords1 = obj1.getBoundingClientRect();
    let coords2 = obj2.getBoundingClientRect();

    // второй объект выше первого
    if (coords1.top > coords2.bottom - offset) return false;
    // второй объект ниже первого
    if (coords1.bottom < coords2.top + offset) return false;
    // второй объект левее первого
    if (coords1.left > coords2.right - offset) return false;
    // второй объект правее первого
    if (coords1.right < coords2.left + offset) return false;

    return true;
  }

  /**
   * Периодически проверяет пересечение объектов
   * @param {GameObject} obj1 
   * @param {GameObject} obj2 
   * @param {Number} [period] периодичность проверки в мс
   */
  watch(obj1, obj2, offset, period = 100) {
    new Dispatcher(obj1);
    new Dispatcher(obj2);

    let timer = setInterval(() => {
      let places = this.check(obj1, obj2, offset);
      if (places) {

        obj1.trigger(Intersector.events.collision, { object: obj2 });
        obj2.trigger(Intersector.events.collision, { object: obj1 });
      }
    }, period);

    return timer;
  }

  stopWatcher(watcher) {
    clearInterval(watcher);
  }
}

/**
 * @static
 */
Intersector.events = {
  collision: "intersector.events.collision",
};

export default Intersector;