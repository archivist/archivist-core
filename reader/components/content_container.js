'use strict';

var Substance = require('substance');
var $$ = React.createElement;
var Surface = Substance.Surface;
var _ = require('substance/helpers');
var Brackets = require('../../shared/components/brackets');
var UnsupportedNode = require('../../shared/components/unsupported_node');
var ContainerEditor = Surface.ContainerEditor;
var ContainerComponent = require('substance-ui/container_component');
var TextProperty = require("substance-ui/text_property");


class ContentContainer extends React.Component {

  getChildContext() {
    return {
      surface: this.state.surface
    };
  }

  computeStateFromProps(props) {
    var doc = props.doc;
    var editor = new ContainerEditor('content');
    var surface = new Surface(this.context.surfaceManager, doc, editor, { name: 'content' });

    return {
      editor: editor,
      surface: surface
    };
  }

  initializeComponent() {
    // We may have already initialized the stuff
    var surface = this.state.surface;
    var contentContainerEl = React.findDOMNode(this.refs.contentContainer);
    var compEl = React.findDOMNode(this);

    this.context.app.registerSurface(surface, {});
    surface.attach(contentContainerEl);

    this.brackets = new Brackets({
      doc: this.props.doc,
      contentContainerEl: contentContainerEl,
      onBracketToggled: this.onBracketToggled.bind(this)
    });
    $(compEl).append(this.brackets.render().$el);
  }

  onBracketToggled(subjectReferenceId) {
    console.log('TODO: override. doing nothing for now...');

    // var app = this.context.app;
    // var state = app.state;

    // if (state.contextId === "editSubjectReference" && state.subjectReferenceId === subjectReferenceId) {
    //   app.replaceState({
    //     contextId: "subjects"
    //   });
    // } else {
    //   app.replaceState({
    //     contextId: "editSubjectReference",
    //     subjectReferenceId: subjectReferenceId,
    //     noScroll: true
    //   });
    // }
  }

  // Lifecycle
  // -------------

  componentWillMount() {
    this.setState(this.computeStateFromProps(this.props));
  }

  componentDidMount() {
    this.initializeComponent();
    // Custom event
    this.props.doc.emit('document:rendered');
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
      // $$(TitleEditor, {doc: this.props.doc}),
      // doc.get([metaNode.id, "title"])

      // $$("div", {className: "document-title"},
      //   $$(TextProperty, {
      //     doc: this.props.doc,
      //     tagName: "div",
      //     className: "title",
      //     path: ["document", "title"]
      //   })
      // ),

      $$(ContainerComponent, {
        ref: 'contentContainer',
        containerId: 'content',
        doc: this.props.doc,
        readOnly: true
      })
      // <Brackets> brackets go here
    );
  }
}

ContentContainer.contextTypes = {
  app: React.PropTypes.object.isRequired,
  componentRegistry: React.PropTypes.object.isRequired,
  notifications: React.PropTypes.object.isRequired,
  surfaceManager: React.PropTypes.object.isRequired
};

ContentContainer.childContextTypes = {
  // provided to editor components so that they know in which context they are
  surface: React.PropTypes.object,
};

ContentContainer.displayName = "ContentContainer";

module.exports = ContentContainer;
