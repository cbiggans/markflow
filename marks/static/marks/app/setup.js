class MarkDiagram {
    
    constructor() {
        this.jsPlumbInstance = this.createInstance();

        this.setEndpointStyle(this.jsPlumbInstance);
    }

    createInstance() {
        var instance = jsPlumb.getInstance({
            // default drag options
            DragOptions: { cursor: 'pointer', zIndex: 2000 },
            // the overlays to decorate each connection with.  note that the label overlay uses a function to generate the label text; in this
            // case it returns the 'labelText' member that we set on each connection in the 'init' method below.
            ConnectionOverlays: [
                [ "Arrow", {
                    location: 1,
                    visible:true,
                    width:11,
                    length:11,
                    id:"ARROW",
                    events:{
                        click:function() { alert("you clicked on the arrow overlay")}
                    }
                } ],
                [ "Label", {
                    location: 0.1,
                    id: "label",
                    cssClass: "aLabel",
                    events:{
                        tap:function() { alert("hey"); }
                    }
                }]
            ],
            Container: "canvas"
        });

        var basicType = {
            connector: "Flowchart",  // Flowchart, StateMachine, Bezier, Straight
            paintStyle: { stroke: "red", strokeWidth: 4 },
            hoverPaintStyle: { stroke: "blue" },
            overlays: [
                ["Arrow", {
                    location: 1,
                }]
            ]
        };

        // This registers the connection type, but doesn't apply it. We currently have a click bind to switch to this type
        instance.registerConnectionType("basic", basicType);

        return instance
    }

    setEndpointStyle(instance) {
        // this is the paint style for the connecting lines..
        var connectorPaintStyle = {
                strokeWidth: 2,
                stroke: "#61B7CF",
                joinstyle: "round",
                outlineStroke: "white",
                outlineWidth: 2
            },
        // .. and this is the hover style.
            connectorHoverStyle = {
                strokeWidth: 3,
                stroke: "#216477",
                outlineWidth: 5,
                outlineStroke: "white"
            },
            endpointHoverStyle = {
                fill: "#216477",
                stroke: "#216477"
            }

        // the definition of source endpoints (the small blue ones)
        instance.sourceEndpoint = {
            endpoint: "Dot",
            paintStyle: {
                stroke: "#7AB02C",
                fill: "transparent",
                radius: 7,
                strokeWidth: 1
            },
            isSource: true,
            connector: [ "Flowchart", { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true } ],
            connectorStyle: connectorPaintStyle,
            hoverPaintStyle: endpointHoverStyle,
            connectorHoverStyle: connectorHoverStyle,
            maxConnections: -1,
            dragOptions: {},
            overlays: [
                [ "Label", {
                    location: [0.5, 1.5],
                    label: "Drag",
                    cssClass: "endpointSourceLabel",
                    visible:false
                } ]
            ]
        }

        // the definition of target endpoints (will appear when the user drags a connection)
        instance.targetEndpoint = {
            endpoint: "Dot",
            paintStyle: { fill: "#7AB02C", radius: 7 },
            hoverPaintStyle: endpointHoverStyle,
            maxConnections: -1,
            dropOptions: { hoverClass: "hover", activeClass: "active" },
            isTarget: true,
            overlays: [
                [ "Label", { location: [0.5, -0.5], label: "Drop", cssClass: "endpointTargetLabel", visible:false } ]
            ]
        }

        // When a connection is created, this method gets called
        //  Currently adds overlay when the connection is called
        instance.init = function (connection) {
            connection.getOverlay("label").setLabel(
                connection.sourceId.substring(15) + "-" + connection.targetId.substring(15)
            );
        };
    }

    initWindowListeners(windowSelector) {
        let self = this
        let instance = self.jsPlumbInstance;

        // listen for new connections; initialise them the same way we initialise the connections at startup.
        self.bindConnection(function (connInfo, originalEvent) {
            instance.init(connInfo.connection);
        });

        // make all the window divs draggable
        instance.draggable(jsPlumb.getSelector(windowSelector), { grid: [20, 20] });

        // THIS DEMO ONLY USES getSelector FOR CONVENIENCE. Use your library's appropriate selector
        // method, or document.querySelectorAll:
        //jsPlumb.draggable(document.querySelectorAll(".window"), { grid: [20, 20] });
    }

    addEndpoints(toId, sourceAnchors, targetAnchors) {
        let instance = this.jsPlumbInstance;
        let windowId = toId.replace('flowchart', '');

        for (var i = 0; i < sourceAnchors.length; i++) {
            var sourceUUID = windowId + sourceAnchors[i];
            instance.addEndpoint(toId, instance.sourceEndpoint, {
                anchor: sourceAnchors[i], uuid: sourceUUID
            });
        }
        // for (var j = 0; j < targetAnchors.length; j++) {
        //     var targetUUID = windowId + targetAnchors[j];
        //     instance.addEndpoint(toId, instance.targetEndpoint, { anchor: targetAnchors[j], uuid: targetUUID });
        // }
    }

    connect(source_uuid, target_uuid) {
        this.jsPlumbInstance.connect({
            uuids: [source_uuid, target_uuid],
            editable: true}
        );
    }

    deleteConnection(connection) {
        this.jsPlumbInstance.deleteConnection(connection);
    }

    // Bindings
    //  TODO XXX: Should create a file called `bindings.js` to add these bindings to the class
    //  NOTE: Having these bindings allows to
    //      * Decouple from underlying JSPlumb library
    //      * Gives easy access to these functions
    //      * Allows to perform things like `unbinding` and cleaning up things in the future

    bind(eventType, func) {
        this.jsPlumbInstance.bind(eventType, func);
    }

    bindClick(func) {
        this.jsPlumbInstance.bind("click", func);
    }

    bindConnectionDrag(func) {
        this.jsPlumbInstance.bind("connectionDrag", func);
    }

    bindConnectionDragStop(func) {
        this.jsPlumbInstance.bind("connectionDragStop", func);
    }

    bindConnectionMoved(func) {
        this.jsPlumbInstance.bind("connectionMoved", func);
    }

    bindConnection(func) {
        this.jsPlumbInstance.bind("connection", func);
    }

    bindDisconnection(func) {
        this.jsPlumbInstance.bind("connectionDetached", func);
    }

};

