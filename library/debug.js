getDebugNode = function(){
    var debug_node = document.getElementById('debug');
    if (debug_node === null) {
        debug_node = document.createElement('div');
        debug_node.id               = 'debug';
        debug_node.style.position   = 'absolute';
        debug_node.style.top        = '0px';
        debug_node.style.left       = '0px';
        document.body.appendChild(debug_node);
    }

    return debug_node;
};


vd_base = function(attributes, imploder){
    var debug_node = getDebugNode();

    for (var i = 0; i < attributes.length; i ++) {
        debug_node.innerHTML += attributes[i];
        if (i + 1 < attributes.length) {
            debug_node.innerHTML += imploder;
        }
    }
};


vd_elase = function(attributes, imploder){
    var debug_node = getDebugNode();
    debug_node.innerHTML = '';

    for (var i = 0; i < attributes.length; i ++) {
        debug_node.innerHTML += attributes[i];
        if (i + 1 < attributes.length) {
            debug_node.innerHTML += imploder;
        }
    }
};


vd = function(){
    var attributes = Array.prototype.slice.call(arguments);
    attributes.push('');
    vd_base(attributes, '<br />');
};


vdl = function(){
    vd_base(arguments, ' | ');
};


vde = function(){
    vd_elase(arguments, '<br />');
};


ve = function(attribute){
    var debug_node = getDebugNode();

    var attribute_var = JSON.parse(attribute);

    
};
