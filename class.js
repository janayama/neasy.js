
    var Class = function(){};

    Class.extend = function(prop) {
        // Este es el proto de la clase de la que se extiende
        // (es decir, el padre)
        var _super = this.prototype;

        // Hacemos el truco del constructor vació para mantener la cadena de prototipos pero sin ejecutar el constructor del padre innecesariamente!
        function F() {};
        F.prototype = _super;
        var proto = new F();

        // recorremos el objeto que nos han pasado como parámetro...
        for (var name in prop) {
            // Comprobar que existe el super-método si no existe, no tiene sentido inyectar nada!
            if (typeof prop[name] == "function" && typeof _super[name] == "function") {
                // Se envuelve en una función inmediata para clausurar el valor de name y fn
                proto[name] = (function(name, fn) {
                    return function() {
                        // guardamos lo que tuviera _super...
                        // var tmp = this._super;
                        // this._super = supermetodo (en proto del padre)
                        this._parent = _super[name];
                        // aplicamos el método decorado (guardamos el retorno)
                        var ret = fn.apply(this, arguments);
                        // se restaura el valor que tenía this._super
                        // this._super = tmp;
                        // devolvemos lo que haya devuelto el metodo decorado
                        return ret;
                    }
                })(name, prop[name]);
            } else {
                // Si no hay supermetodo o no es una función, nos limitamos a copiar la propiedad
                proto[name] = prop[name];
            }
        }

        // Si existe this.init, lo llamamos al construir una nueva instancia
        function Klass() {
            if (this.init) this.init.apply(this, arguments);
        }

        Klass.prototype = proto;
        // Ponemos a mano el nuevo valor del constructor
        Klass.prototype.constructor = Klass;

        //console.log(this);
        for (var prop in this) {
            //console.log('prop: ' + prop);
            if(this.hasOwnProperty(prop)) {
                Klass[prop] = this[prop];

                // crear diferentes instancias por cada extension
                if (typeof this[prop] == 'object' && this[prop].constructor) Klass[prop] = new this[prop].constructor;
            }
        }

        // Para que se pueda heredar de las clases generadas, copiamos la función .extend
        Klass.extend = this.extend;

        



        return Klass;
    };

    Object.prototype.clone = function() {
        var newObj = (this instanceof Array) ? [] : {};
        for (i in this) {
            if (i == 'clone') continue;
            if (this[i] && typeof this[i] == "object") {
                newObj[i] = this[i].clone();
            } else newObj[i] = this[i]
        } return newObj;
    };

    module.exports = Class;