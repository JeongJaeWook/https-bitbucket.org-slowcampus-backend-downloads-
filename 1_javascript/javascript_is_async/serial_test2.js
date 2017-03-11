function a(cb) { setTimeout(function() { console.log('aaa'); cb(); }, 1000); }

function b(cb) { setTimeout(function() { console.log('bbb'); cb(); }, 500); }

function c(cb) { setTimeout(function() { console.log('ccc'); cb(); }, 1500); }

function d() { setTimeout(function() { console.log('ddd'); }, 1000); }

function series(funclist)
{
        var i = 0;

        function run()
        {
                if(i >= funclist.length)
                        return;

                var func = funclist[i++];
                func(run);
        }

        run();
}


array = [a, b, c, d];
series(array);
