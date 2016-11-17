'use strict';

const EventSource = (() => {

    const EVENTS = Symbol(`events`);
    const REAL_ADD_EVENT_LISTENER = Symbol(`realAddEventListener`);
    const REAL_REMOVE_EVENT_LISTENER = Symbol(`realRemoveEventListener`);

    return class EventSource {
        constructor(object) {
            /** @type *<{{true: Array<function(Event)>, false: Array<function(Event)>}}> */
            this[EVENTS] = {};

            if (`addEventListener` in object)
                this[REAL_ADD_EVENT_LISTENER] = object.addEventListener.bind(object);

            if (`removeEventListener` in object)
                this[REAL_REMOVE_EVENT_LISTENER] = object.removeEventListener.bind(object);
        }

        /**
         * Добавляет к объекту событие, на которое после этого можно будет вешать обработчики при помощи метода
         * <code>{@link #addEventListener}</code>.
         *
         * @param {Array<string>} name имя события (которое потом нужно будет передавать первым параметром - type - в
         * метод <code>addEventListener</code>).
         *
         * @returns function(Event) функция, которую нужно вызывать в ответ на событие, передавая ей при вызове объект
         * события. Функция будет вызывать все слушатели по порядку, передавая им этот объект.
         */
        addEventType(name) {

            if (name in this[EVENTS])
                throw new Error(`Cобытие ${name} уже есть!`);

            /**
             * @type {{true: Array<function(Event)>, false: Array<function(Event)>}}
             */
            this[EVENTS][name] = {
                true: [],
                false: [],
            };

            return event => {

                if (!(name in this[EVENTS]))
                    throw new Error(`Событие '${name}' для данного объекта не определено!`);

                this[EVENTS][name][true]
                    .forEach(listener => listener(event));

                this[EVENTS][name][false]
                    .forEach(listener => listener(event));
            }
        }

        /**
         * Удаляет событие и всех его слушателей из объекта.
         * @param {string} name Имя события, назначенное ему ранее при вызове метода <code>{@link #addEventType}</code>.
         */
        removeEventType(name) {
            if (!(name in this[EVENTS]))
                throw new Error(`События ${name} уже итак нет, либо оно не было создано при помощи метода 'addEvent'!`);

            delete this[EVENTS][name];
        }

        /**
         * Добавляет к объекту слушателя события, ранее созданного при помощи вызова метода
         * <code>{@link #addEventType}</code>. Если метод <code>addEventListener</code> у объекта уже есть, данный метод
         * выступает в качестве его Proxy, вызывая его для событий, которые не были созданы при помощи вызова метода
         * <code>{@link #addEventType}</code>.
         * @param {string} eventType Имя события объекта
         * @param {function(Event)} handler Обработчик события
         * @param {boolean} [isPropagation=false]
         * @returns {function(Event)} Параметр, переданный функции вторым - <em>handler</em>.
         */
        addEventListener(eventType, handler, isPropagation = false) {
            if (eventType in this[EVENTS])
                this[EVENTS][eventType][isPropagation].push(handler);
            else if (this[REAL_ADD_EVENT_LISTENER])
                this[REAL_ADD_EVENT_LISTENER].apply(this, arguments);

            return handler;
        }

        /**
         * Удаляет из объекта обработчик события, ранее созданного при помощи вызова метода
         * <code>{@link #addEventType}</code>. Если метод <code>removeEventListener</code> у объекта уже есть, данный
         * метод выступает в качестве его Proxy, сохраняя его в замыкании и вызывая его для событий, которые не были
         * созданы при помощи вызова метода <code>{@link #addEventType}</code>.
         * @param {string} eventType Имя события объекта
         * @param {function(Event)} handler Обработчик события
         * @param {boolean} [isPropagation=false]
         * @returns {boolean} Остались ли ещё обработчики для данного события? Возврат значения <code>false</code>
         * указывает на бессмысленность дальнейшего вызова функции, возвращённой методом
         * <code>{@link #addEventType}</code> при создании данного события - пока при помощи метода
         * <code>{@link #addEventListener}</code> не будет прикреплён хотя бы один новый обработчик.
         */
        removeEventListener(eventType, handler, isPropagation = false) {
            let /** @type Array<function(Event)> */ listeners,
                /** @type number */ index;
            if (eventType in this[EVENTS] &&
                (index =
                        (listeners = this[EVENTS][eventType][isPropagation])
                            .indexOf(handler)
                ) !== -1)
                listeners.splice(index, 1);
            else if (this[REAL_REMOVE_EVENT_LISTENER])
                this[REAL_REMOVE_EVENT_LISTENER].apply(this, arguments);

            return listeners.length > 0 || this[EVENTS][eventType][!isPropagation].length > 0;
        }

        /**
         * Метод делает переданный ему объект Observer`ом, т.е. генератором событий, на которые можно подписываться и
         * от которых можно отписываться. После её вызова у переданного ей объекта появляются 2 пары методов:
         * <code>addEventType(name)</code> и <code>removeEventType(name)</code> для добавления/удаления событий и пара
         * функций <code>{@link #addEventListener}</code> и <code>{@link #removeEventListener}</code> для добавления и
         * удаления обработчиков событий.
         *
         * @template T
         * @param {T} that любой объект JavaScript, который нужно сделать Observer`ом.
         * @returns {T} переданный в качестве аргумента, обогащённый методами <code>{@link #addEventType}</code>,
         * <code>{@link #addEventListener}</code> и <code>{@link #removeEventListener}</code> объект
         * <code><em>that</em></code>.
         */
        static setAddEvent(that) {
            return Object.assign(
                Object.assign(that, new EventSource(that)),
                // EventSource.prototype);
                {
                    addEventType: EventSource.prototype.addEventType,
                    removeEventType: EventSource.prototype.removeEventType,
                    addEventListener: EventSource.prototype.addEventListener,
                    removeEventListener: EventSource.prototype.removeEventListener,
                });
        }
    }
})();


//Test
const event1Call = EventSource.setAddEvent(window).addEventType('event1'),
    event1Listener1 = window.addEventListener('event1', () => console.log('Событие 1 произошло! (обработчик всплытия)')),
    event1Listener2 = window.addEventListener('event1', () => console.log('Событие 1 произошло! (2-й обработчик всплытия)'), false);
window.addEventListener('event1', () => console.log('Событие 1 произошло! (обработчик погружения)'), true);
event1Call();
window.addEventListener('load', () => console.log('При этом прочие обработчики по прежнему работают!'), false);
console.log('Остались ли ещё обработчики? - ' + (window.removeEventListener('event1', event1Listener1, false) ? 'Да' : 'Нет'));
event1Call();
console.log('Остались ли ещё обработчики? - ' + (window.removeEventListener('event1', event1Listener2, false) ? 'Да' : 'Нет'));
event1Call();
window.removeEventType('event1');
try {
    event1Call();
} catch (/** @type Error */ e) {
    console.error(e.message);
}
