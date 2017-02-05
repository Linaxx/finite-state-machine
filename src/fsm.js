class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if(!config) {
            throw new Error();
        }
        this._undo = [];
        this._redo = [];
        this.config = config;
        this.state = this.config.initial;
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.state;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if(!Object.keys(this.config.states).includes(state)) {
            throw new Error();
        }
        this._undo.push(this.state);
        this._redo = [];
        this.state = state;
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        var newState = this.config.states[this.state].transitions[event];
        
        if(!newState) {
            throw new Error();
        }
        
        this._undo.push(this.state);
        this._redo = [];
        this.state = newState;
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this._undo.push(this.state);
        this._redo = [];
        this.state = this.config.initial;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        if(!event) {
            return Object.keys(this.config.states);
        } else {
            var states = this.config.states;
            return Object.keys(states).filter(
                function(state) {
                    return Object.keys(states[state].transitions).  includes(event);
                });
        }
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if(this._undo.length > 0) {
            this._redo.push(this.state);
            this.state = this._undo.pop();
            return true;
        } else {
            return false;
        }
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if(this._redo.length > 0) {
            this._undo.push(this.state);
            this.state = this._redo.pop();
            return true;
        } else {
            return false;
        }       
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this._undo = [];
        this._redo = [];
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
