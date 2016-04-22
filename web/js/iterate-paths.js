// not that this is really a reusable utility, just trying not to copy and paste
// too much between index.js and nepal.js

function iterate_paths(diagram, paths) {
    if(paths) {
        // make sure it draws first (?)
        setTimeout(function() {
            d3.json(paths, function(error, pathv) {
                if(error)
                    throw new Error(error);
                var i = 0;
                setInterval(function() {
                    // i continue not to understand the horrible concurrency issues
                    // i'm running into - double-draws can peg the CPU
                    if(diagram.isRunning())
                        return;
                    var path = pathv.results[i].element_list;
                    var pnodes = {}, pedges = {};
                    path.forEach(function(el) {
                        switch(el.element_type) {
                        case 'node':
                            pnodes[el.property_map.ecomp_uid] = true;
                            break;
                        case 'edge':
                            pedges[el.property_map.source_ecomp_uid + '-' + el.property_map.target_ecomp_uid] = true;
                            break;
                        }
                    });
                    diagram
                        .edgeStrokeWidth(function(e) {
                            return pedges[diagram.edgeKey()(e)] ? 4 : 1;
                        })
                        .edgeStroke(function(e) {
                            return pedges[diagram.edgeKey()(e)] ? 'red' : 'black';
                        })
                        .nodeStrokeWidth(function(n) {
                            return pnodes[diagram.nodeKey()(n)] ? 3 : 1;
                        })
                        .nodeStroke(function(n) {
                            return pnodes[diagram.nodeKey()(n)] ? 'red' : 'black';
                        })
                        .redraw();
                    i = (i+1) % pathv.results.length;
                }, 2000);
            });
        }, 1000);
    }
}
