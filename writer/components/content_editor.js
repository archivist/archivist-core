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

var ENABLED_TOOLS = ["strong", "emphasis", "timecode", "remark", "entity_reference", "subject_reference"];

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

    this.context.app.registerSurface(surface, {
      enabledTools: ENABLED_TOOLS
    });

    surface.attach(contentContainerEl);

    this.brackets = new Brackets({
      doc: this.props.doc,
      contentContainerEl: contentContainerEl,
      onBracketToggled: this.onBracketToggled.bind(this)
    });
    $(compEl).append(this.brackets.render().$el);
  }

  onBracketToggled(subjectReferenceId) {
    var app = this.context.app;
    var state = app.state;

    if (state.contextId === "editSubjectReference" && state.subjectReferenceId === subjectReferenceId) {
      app.replaceState({
        contextId: "subjects"
      });
    } else {
      app.replaceState({
        contextId: "editSubjectReference",
        subjectReferenceId: subjectReferenceId,
        noScroll: true
      });
    }
  }

  // Lifecycle
  // -------------

  componentWillMount() {
    this.setState(this.computeStateFromProps(this.props));
  }

  componentDidMount() {
    this.initializeComponent();
  }

  componentDidUpdate() {
    this.brackets.render();
    this.brackets.updateBrackets();
  }

  componentWillUnmount() {
    this.dispose();
  }

  dispose() {
    var surface = this.state.surface;
    this.context.surfaceManager.unregisterSurface(surface);
    this.brackets.dispose();
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
      // <Brackets> brackets go here
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
