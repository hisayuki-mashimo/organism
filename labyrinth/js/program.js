var Labylinth = function(params){
    if (params !== undefined) {
        this.init(params);
    }
};

Labylinth.prototype = {
    // 外部参照変数
    size: {},

    progress: {},

    // 内部管理変数
    _pillers:       {},
    _pillers_blank: {},

    _build_phase:             0,
    _build_coordinate:        {},
    _build_coordinates:       {},
    _build_coordinate_params: {},

    _solve_piller_params: {},
    _solve_chain:         [],

    _direction_id: {
        T: 1,
        R: 2,
        B: 4,
        L: 8
    },

    // 外部参照関数
    init: function(params)
    {
        if (params.size  !== undefined) this.size = params.size;

        if (params.solve !== undefined) {
            this._solve_piller_params = {
                start_X: params.solve.start_X,
                start_Y: params.solve.start_Y,
                end_X:   params.solve.end_X,
                end_Y:   params.solve.end_Y
            };
        } else {
            this._solve_piller_params = {
                start_X: 0,
                start_Y: 0,
                end_X:   params.size.X - 1,
                end_Y:   params.size.Y - 1
            };
        }

        this.progress.extended = false;
        this.progress.built    = false;

        this._pillers       = {};
        this._pillers_blank = {};

        this._build_phase               = 0;
        this._build_coordinate          = {};
        this._build_coordinates         = {};
        this._build_coordinate_params.T = {};
        this._build_coordinate_params.R = {};
        this._build_coordinate_params.B = {};
        this._build_coordinate_params.L = {};

        this._solve_chain = [];
    },

    prepare: function()
    {
        Array.apply(this, Array(this.size.X + 1)).forEach(function(value_X, X){
            Array.apply(this, Array(this.size.Y + 1)).forEach(function(value_Y, Y){
                this._pillers[X + '.' + Y] = 0;

                switch (true) {
                    case (X === 0):
                    case (Y === 0):
                    case (X === this.size.X):
                    case (Y === this.size.Y):
                        break;

                    default:
                        this._pillers_blank[X + '.' + Y] = {X: X, Y: Y};
                        break;
                }
            }, this);
        }, this);
    },

    build: function()
    {
        if (this._build_phase == 2) {
            this.progress.built = true;

            return;
        }

        if (this._build_phase == 0) {
            this._specifyBuildPiller();

            this._build_phase = 1;
        }

        this._extendPiller();

        if (this.progress.extended) {
            if (! Object.keys(this._pillers_blank).length) {
                this._build_phase = 2;
            } else {
                this._build_phase = 0;

                this.progress.extended = false;
            }
        }
    },

    solve: function()
    {
        if (this.progress.solve) {
             var pres_coordinate = this.progress.solve.coordinate;
             var pres_direction  = this._getEgoDirections(this.progress.solve.coordinate.D, 'L');
        } else {
            var pres_coordinate = {
                X: this._solve_piller_params.start_X,
                Y: this._solve_piller_params.start_Y
            };

            var pres_direction = 'L';

            this._solve_chain.push({
                X: this._solve_piller_params.start_X,
                Y: this._solve_piller_params.start_Y
            });

            this.progress.solve = {};
        }

        this.progress.solve.coordinate = null;

        var ego_directions = this._getEgoDirections(pres_direction);

        Object.keys(ego_directions).forEach(function(ego_direction_key){
            if (this.progress.solve.coordinate) return;

            var next_direction  = ego_directions[ego_direction_key];
            var next_coordinate = this._slide(pres_coordinate.X, pres_coordinate.Y, next_direction);

            if (next_coordinate.X >= this.size.X) return;
            if (next_coordinate.Y >= this.size.Y) return;

            var next_piller = this._getPiller(next_coordinate.X, next_coordinate.Y);

            if (next_piller === null) return;

            switch (next_direction) {
                case 'T':
                    var target_piller = this._getPiller(pres_coordinate.X, pres_coordinate.Y);
                    if (target_piller & this._direction_id['R']) return;
                    break;

                case 'R':
                    var target_coordinate = this._slide(pres_coordinate.X, pres_coordinate.Y, next_direction);
                    var target_piller = this._getPiller(target_coordinate.X, target_coordinate.Y);
                    if (target_piller & this._direction_id['B']) return;
                    break;

                case 'B':
                    var target_coordinate = this._slide(pres_coordinate.X, pres_coordinate.Y, next_direction);
                    var target_piller = this._getPiller(target_coordinate.X, target_coordinate.Y);
                    if (target_piller & this._direction_id['R']) return;
                    break;

                case 'L':
                    var target_piller = this._getPiller(pres_coordinate.X, pres_coordinate.Y);
                    if (target_piller & this._direction_id['B']) return;
                    break;
            }

            this.progress.solve.coordinate = {
                X: next_coordinate.X,
                Y: next_coordinate.Y,
                D: next_direction
            };

            if ((next_coordinate.X == this._solve_piller_params.end_X) && (next_coordinate.Y == this._solve_piller_params.end_Y)) {
                this.progress.solved = true;

                this.progress.solve.elase_coordinate = null;

                this._solve_chain.splice(0, 1);
            } else {
                switch (true) {
                    case (this._solve_chain.length <= 1):
                    case (this._solve_chain[this._solve_chain.length - 2].X != next_coordinate.X):
                    case (this._solve_chain[this._solve_chain.length - 2].Y != next_coordinate.Y):
                        this.progress.solve.elase_coordinate = null;

                        this._solve_chain.push({X: next_coordinate.X, Y: next_coordinate.Y});
                        break;

                    default:
                        this.progress.solve.elase_coordinate = {
                            X: this._solve_chain[this._solve_chain.length - 1].X,
                            Y: this._solve_chain[this._solve_chain.length - 1].Y
                        };

                        this._solve_chain.splice((this._solve_chain.length - 1), 1);
                        break;
                }
            }
        }, this);
    },

    export: function()
    {
        var pillers = [];

        Array.apply(this, Array((this.size.X * 2) - 1)).forEach(function(value_X, X){
            pillers[X] = [];

            Array.apply(this, Array((this.size.Y * 2) - 1)).forEach(function(value_Y, Y){
                pillers[X][Y] = ((X % 2) && (Y % 2)) ? 0 : 1;
            }, this);
        }, this);

        Array.apply(this, Array(this.size.X)).forEach(function(value_X, X){
            Array.apply(this, Array(this.size.Y)).forEach(function(value_Y, Y){
                var piller = this._getPiller(X, Y);

                if (piller & this._direction_id.R) pillers[(X * 2)][(Y * 2) - 1] = 0;
                if (piller & this._direction_id.B) pillers[(X * 2) - 1][(Y * 2)] = 0;
            }, this);
        }, this);

        return pillers;
    },

    // 内部参照関数
    _specifyBuildPiller: function()
    {
        var pillers_blank_pointers = Object.keys(this._pillers_blank);
        var pillers_blank_pointer  = pillers_blank_pointers[Math.floor(Math.random() * pillers_blank_pointers.length)];

        this._build_coordinate = this._pillers_blank[pillers_blank_pointer];

        this._build_coordinates[this._build_coordinate.X + '.' + this._build_coordinate.Y] = true;

        delete this._pillers_blank[pillers_blank_pointer];

        this._build_coordinate_params.T[this._build_coordinate.Y] = this._build_coordinate.X;
        this._build_coordinate_params.R[this._build_coordinate.X] = this._build_coordinate.Y;
        this._build_coordinate_params.B[this._build_coordinate.Y] = this._build_coordinate.X;
        this._build_coordinate_params.L[this._build_coordinate.X] = this._build_coordinate.Y;
    },

    _extendPiller: function()
    {
        var pres_coordinate = this._build_coordinate;

        this._build_coordinate = null;

        this._getDirections(null, true).forEach(function(next_direction){
            if (this._build_coordinate) return;

            var next_coordinate = this._slide(pres_coordinate.X, pres_coordinate.Y, next_direction);
            var next_piller     = this._getPiller(next_coordinate.X, next_coordinate.Y);

            if (next_piller === null) return;
            if (this._build_coordinates[next_coordinate.X + '.' + next_coordinate.Y]) return;

            if ((this._build_coordinate_params.T[next_coordinate.Y] === undefined) || (this._build_coordinate_params.T[next_coordinate.Y] > next_coordinate.X)) this._build_coordinate_params.T[next_coordinate.Y] = next_coordinate.X;
            if ((this._build_coordinate_params.R[next_coordinate.X] === undefined) || (this._build_coordinate_params.R[next_coordinate.X] < next_coordinate.Y)) this._build_coordinate_params.R[next_coordinate.X] = next_coordinate.Y;
            if ((this._build_coordinate_params.B[next_coordinate.Y] === undefined) || (this._build_coordinate_params.B[next_coordinate.Y] < next_coordinate.X)) this._build_coordinate_params.B[next_coordinate.Y] = next_coordinate.X;
            if ((this._build_coordinate_params.L[next_coordinate.X] === undefined) || (this._build_coordinate_params.L[next_coordinate.X] > next_coordinate.Y)) this._build_coordinate_params.L[next_coordinate.X] = next_coordinate.Y;

            switch (true) {
                case (next_coordinate.X === 0):
                case (next_coordinate.Y === 0):
                case (next_coordinate.X === this.size.X):
                case (next_coordinate.Y === this.size.Y):
                case (this._pillers[next_coordinate.X + '.' + next_coordinate.Y] > 0):
                    this.progress.extended = true;

                    this._build_coordinates = {};

                    this._getDirections().forEach(function(direction){
                        this._build_coordinate_params[direction] = {};
                    }, this);
                    break;

                default:
                    this._build_coordinates[next_coordinate.X + '.' + next_coordinate.Y] = true;
                    break;
            }

            this._pillers[next_coordinate.X + '.' + next_coordinate.Y] += this._direction_id[this._getEgoDirections(next_direction, 'B')];
            this._pillers[pres_coordinate.X + '.' + pres_coordinate.Y] += this._direction_id[next_direction];

            delete this._pillers_blank[next_coordinate.X + '.' + next_coordinate.Y];

            this.progress.from = {X: pres_coordinate.X, Y: pres_coordinate.Y};
            this.progress.to   = {X: next_coordinate.X, Y: next_coordinate.Y};

            this._build_coordinate   = next_coordinate;
            this._build_coordinate.D = next_direction;
        }, this);

        if (this._build_coordinate) {
            return;
        }

        var pillers_side_direction = this._getDirections(null, true).shift();
        var pillers_side           = this._build_coordinate_params[pillers_side_direction];
        var pillers_side_pointers  = Object.keys(pillers_side);
        var pillers_side_pointer   = pillers_side_pointers[Math.floor(Math.random() * pillers_side_pointers.length)];

        switch (pillers_side_direction) {
            case 'T':
            case 'B':
                var X = parseInt(pillers_side[pillers_side_pointer]);
                var Y = parseInt(pillers_side_pointer);
                break;

            case 'R':
            case 'L':
                var X = parseInt(pillers_side_pointer);
                var Y = parseInt(pillers_side[pillers_side_pointer]);
                break;
        }

        this._build_coordinate = {X: X, Y: Y};
    },

    _getPiller: function(X, Y)
    {
        return (this._pillers[X + '.' + Y] !== undefined) ? this._pillers[X + '.' + Y] : null;
    },

    _slide: function(X, Y, direction)
    {
        switch (direction) {
            case 'T': return {X: X, Y: Y - 1};
            case 'R': return {X: X + 1, Y: Y};
            case 'B': return {X: X, Y: Y + 1};
            case 'L': return {X: X - 1, Y: Y};
        }
    },

    _getDirections: function(exclude_directions, do_shuffle)
    {
        var directions = ['T', 'R', 'B', 'L'];

        if (exclude_directions) {
            exclude_directions.forEach(function(exclude_direction){
                directions.forEach(function(direction, pointer){
                    if (exclude_direction === direction) {
                        directions.splice(pointer, 1);
                    }
                });
            });
        }

        if (do_shuffle) {
            directions.forEach(function(direction_O, pointer_O){
                var pointer_A = (directions.length - 1) - pointer_O;
                var pointer_B = Math.floor(Math.random() * (pointer_A + 1));

                var direction_A = directions[pointer_A];
                var direction_B = directions[pointer_B];

                directions[pointer_A] = direction_B;
                directions[pointer_B] = direction_A;
            }, this);
        }

        return directions;
    },

    _getEgoDirections: function(direction, relative_direction)
    {
        switch (direction) {
            case 'T': var directions = {'T': 'T', 'R': 'R', 'B': 'B', 'L': 'L'}; break;
            case 'R': var directions = {'T': 'R', 'R': 'B', 'B': 'L', 'L': 'T'}; break;
            case 'B': var directions = {'T': 'B', 'R': 'L', 'B': 'T', 'L': 'R'}; break;
            case 'L': var directions = {'T': 'L', 'R': 'T', 'B': 'R', 'L': 'B'}; break;
        }

        return relative_direction ? directions[relative_direction] : directions;
    }
};
