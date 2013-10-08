var Container = function()
{
};


Container.prototype = {
    //weapons:    null,


    STRs: {},
    SLFs: {},


    contrast: {
        STR01: 'Z',
        STR02: 'X',
        STR03: 'C'
    },


    /**
     * 依存オブジェクト
     *
     */
    depends: new Array(
        'player',
        'weapons'
    ),




    init: function()
    {
        var ref = this;

        $('table#STR td').each(function(){
            var code = $(this).attr('id');
            ref.STRs[code] = {
                node:   this,
                stored: null
            };
            this.ondragover = function(event){
                event.preventDefault();
            };
            this.ondrop = function(event){
                ref.onDrop(event);
            };
        });
        $('table#SLF td').each(function(){
            var code = $(this).attr('id');
            ref.SLFs[code] = {
                node:   this,
                stored: null
            };
            this.ondragover = function(event){
                event.preventDefault();
            };
            this.ondrop = function(event){
                ref.onDrop(event);
            };
        });

        for(var i in this.weapons){
            var weapon = this.weapons[i];
            var image_node = document.createElement('img');
            $(image_node).attr('id',        'equ-' + weapon.object_key);
            $(image_node).attr('src',       weapon.getImagePath('thumb'));
            $(image_node).attr('title',     weapon.title);
            $(image_node).attr('draggable', true);
            image_node.ondragstart = function(event){
                ref.onStart(event);
            };
            switch(weapon.equiped){
                case true:
                    var container = this.STRs['STR' + weapon.key_code];
                    break;
                case false:
                    for(var i in this.SLFs){
                        var SLF = this.SLFs[i];
                        if(this.SLFs[i].stored == null){
                            var container = this.SLFs[i];
                            break;
                        }
                    }
                    break;
            }
            container.node.appendChild(image_node);
            container.stored = weapon;
        }
    },


    onStart: function(event)
    {
        var target_element      = event.target;
        var from_element        = target_element.parentNode;
        var target_element_id   = $(target_element).attr('id');
        var from_element_id     = $(from_element).attr('id');
        var trans_code = from_element_id + '>>' + target_element_id;
        event.dataTransfer.setData('tar', trans_code);
    },


    onDrop: function(event)
    {
        var trans_code          = event.dataTransfer.getData('tar');
        var target_element_id   = trans_code.replace(/.*>>/, '');
        var pre_element_id      = trans_code.replace(/>>.*/, '');
        var pre_element_type    = pre_element_id.replace(/[0-9]+/, '');
        var pre_element_code    = pre_element_id.replace(/(STR|SLF)/, '');
        var target_element      = document.getElementById(target_element_id);
        var to_element          = event.currentTarget;
        var to_element_type     = $(to_element).attr('id').replace(/[0-9]+/, '');
        var to_element_code     = $(to_element).attr('id').replace(/(STR|SLF)/, '');
        var weapon_key          = $(target_element).attr('id').replace(/equ-/, '');
        var weapon              = this.weapons[weapon_key];

        if(weapon.equiped == true){
            delete this.player.weapons['L-' + weapon.key_code];
            weapon.equiped  = false;
            weapon.key_code = false;
        }

        to_element.appendChild(target_element);
        event.preventDefault();

        switch(pre_element_type){
            case 'STR': pre_container = this.STRs['STR' + pre_element_code]; break;
            case 'SLF': pre_container = this.SLFs['SLF' + pre_element_code]; break;
        }
        switch(to_element_type){
            case 'STR': pst_container = this.STRs['STR' + to_element_code]; break;
            case 'SLF': pst_container = this.SLFs['SLF' + to_element_code]; break;
        }
        var old_weapon = pst_container.stored;
        pre_container.stored = null;
        pst_container.stored = weapon;

        if(old_weapon != null){
            if(old_weapon.equiped == true){
                old_weapon.equiped  = false;
                old_weapon.key_code = false;
            }

            var old_weapon_image = document.getElementById('equ-' + old_weapon.object_key);
            to_element.removeChild(old_weapon_image);
            for(var i in this.SLFs){
                var SLF = this.SLFs[i];
                if(SLF.stored == null){
                    SLF.node.appendChild(old_weapon_image);
                    SLF.stored = weapon;
                    break;
                }
            }
        }

        if(to_element_type == 'STR'){
            this.player.weapons['L-' + to_element_code] = weapon;
            weapon.equiped  = true;
            weapon.key_code = to_element_code;
        }
    }
};
