'use strict';

var Substance = require('substance');
var $$ = React.createElement;
var Surface = Substance.Surface;
var _ = require('substance/helpers');
var TitleEditor = require("./title_editor");
var Brackets = require('./brackets');
var UnsupportedNode = require('./nodes/unsupported_node');
var ContainerEditor = Surface.ContainerEditor;
var ContainerComponent = require('substance-ui/container_component');



class ContentEditor extends React.Component {

  getChildContext() {
    return {
      surface: this.state.surface
    };
  }

  computeStateFromProps(props) {
    var doc = props.doc;
    var editor = new ContainerEditor('content');
    var surface = new Surface(this.context.surfaceManager, doc, editor);

    return {
      editor: editor,
      surface: surface
    };
  }

  initializeComponent() {
    // We may have already initialized the stuff
    var surfaceManager = this.context.surfaceManager;
    var surface = this.state.surface;
    var contentContainerEl = React.findDOMNode(this.refs.contentContainer);
    var compEl = React.findDOMNode(this);

    surfaceManager.registerSurface(surface, {
      enabledTools: this.props.enabledTools
    });

    surface.attach(contentContainerEl);

    this.brackets = new Brackets({
      doc: this.props.doc,
      contentContainerEl: contentContainerEl
    });
    $(compEl).append(this.brackets.render().$el);

    // Needed?
    // this.forceUpdate(function() {
    //   this.surface.rerenderDomSelection();
    // }.bind(this));
  }

  // Lifecycle
  // -------------

  // Creation

  componentWillMount() {
    this.setState(this.computeStateFromProps(this.props));
  }

  componentDidMount() {
    this.initializeComponent();
  }

  // Updating

  componentWillReceiveProps(nextProps) {
    this.dispose(); // clean up before setting up new state
    this.setState(this.computeStateFromProps(nextProps));
  }

  // a new doc has arrived
  componentDidUpdate() {
    this.initializeComponent();
  }

  componentWillUnmount() {
    this.dispose();
  }

  dispose() {
    var surface = this.state.surface;
    this.context.surfaceManager.unregisterSurface(surface);

    if (surface) {
      surface.disconnect(this);
      surface.dispose();
    }
  }

  render() {
    return $$('div', {className: 'content-editor-component panel-content-inner'},
      $$(TitleEditor, {doc: this.props.doc}),
      $$(ContainerComponent, {
        ref: 'contentContainer',
        containerId: 'content',
        doc: this.props.doc
      })
      // brackets go here
    );
  }
}

ContentEditor.contextTypes = {
  app: React.PropTypes.object.isRequired,
  componentRegistry: React.PropTypes.object.isRequired,
  notifications: React.PropTypes.object.isRequired,
  surfaceManager: React.PropTypes.object.isRequired
};

ContentEditor.childContextTypes = {
  // provided to editor components so that they know in which context they are
  surface: React.PropTypes.object,
};

ContentEditor.displayName = "ContentEditor";

module.exports = ContentEditor;
