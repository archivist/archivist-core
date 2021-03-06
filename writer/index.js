'use strict';

// Science Writer
// ---------------
//
// Configures a simple writer for the substance journal, using the generic SubstanceWriter implementation

var $$ = React.createElement;

// Core Writer from Substance UI
// ---------------
//

var SubstanceWriter = require("substance-ui/writer");

// Configuration
// ---------------
//

var tools = require('./tools');
var components = require('./components');
var stateHandlers = require('./state_handlers');
var panelOrder = ["subjects", "entities", "comments", "metadata"];


// Specify a Notification service
// ---------------
//

// Top Level Application
// ---------------
//
// Adjust for your own needs

class ArchivistWriter extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      doc: null
    };
  }

  componentDidMount() {
    var backend = this.context.backend;
    var notifications = this.context.notifications;

    notifications.addMessage({
      type: "info",
      message: "Loading..."
    });

    backend.getDocument(this.props.documentId || "example_document", function(err, doc) {
      if (err) {
        this.setState({
          errorMessage: err.message || err.toString()
        });
      } else {
        // After here we won't allow non-transactional changes
        doc.FORCE_TRANSACTIONS = true;
        this.setState({
          doc: doc
        });
      }
    }.bind(this));
  }

  componentWillReceiveProps() {
    var backend = this.context.backend;
    var notifications = this.context.notifications;


    this.setState({
      doc: null
    });

    backend.getDocument(this.props.documentId || "example_document", function(err, doc) {
      if (err) {
        this.setState({
          errorMessage: err.message || err.toString()
        });
      } else {
        this.setState({
          doc: doc
        });
      }
    }.bind(this));
  }

  render() {
    if (this.state.doc) {
      return $$(SubstanceWriter, {
        config: {
          components: components,
          tools: tools,
          stateHandlers: stateHandlers,
          panelOrder: panelOrder
        },
        route: window.location.hash.slice(1),
        doc: this.state.doc,
        id: "writer",
        contentContainer: 'content',
        contextId: 'subjects'
      });
    } else if (this.state.errorMessage) {
      return $$('div', {className: 'error-message'}, this.state.errorMessage);
    } else {
      return $$('div', {className: 'loading-message'}, 'Loading document... This may take a few seconds.');
    }
  }
}

ArchivistWriter.displayName = "ArchivistWriter";

ArchivistWriter.contextTypes = {
  backend: React.PropTypes.object.isRequired,
  notifications: React.PropTypes.object.isRequired
};


module.exports = ArchivistWriter;