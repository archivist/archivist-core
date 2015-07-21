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
        notifications.addMessage({
          type: "error",
          message: err.message || err.toString()
        });
      } else {

        // After here we won't allow non-transactional changes
        doc.FORCE_TRANSACTIONS = true;
        this.setState({
          doc: doc
        });
        
        notifications.addMessage({
          type: "info",
          message: "No changes"
        });
      }
    }.bind(this));
  }

  componentWillReceiveProps() {
    var backend = this.context.backend;
    var notifications = this.context.notifications;

    notifications.addMessage({
      type: "info",
      message: "Loading..."
    });

    this.setState({
      doc: null
    });

    backend.getDocument(this.props.documentId || "example_document", function(err, doc) {
      if (err) {
        notifications.addMessage({
          type: "error",
          message: err.message || err.toString()
        });
      } else {

        this.setState({
          doc: doc
        });
        
        notifications.addMessage({
          type: "info",
          message: "No changes"
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
        doc: this.state.doc,
        id: "writer",
        contentContainer: 'content',
        contextId: 'subjects'
      });
    } else {
      return $$('div', null, '');
    }
  }
}

ArchivistWriter.displayName = "ArchivistWriter";

ArchivistWriter.contextTypes = {
  backend: React.PropTypes.object.isRequired
};


module.exports = ArchivistWriter;