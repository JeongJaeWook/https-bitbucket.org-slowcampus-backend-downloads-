function T(callback)
{
        setTimeout(function() { console.log('print'); callback(); }, 1000)
}

var array = [T, T, T, T]
series(array)

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
