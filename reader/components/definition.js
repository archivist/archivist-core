var $$ = React.createElement;

// Prison view
// ----------------

class Definition extends React.Component {
  handleEdit(e) {
    e.stopPropagation();
  }

  handleToggle(e) {
    e.preventDefault();
    this.props.handleToggle(this.props.entity.id, this.props.entity.type);
  }

  render() {
    var definition = this.props.entity;

    var className = ["entity definition"];
    if (this.props.active) className.push("active");
    return $$("div", {"data-id": definition.id, className: className.join(" "), onClick: this.handleToggle.bind(this)},
      $$("div", {className: "title"}, definition.title),
      $$("div", {className: "description", dangerouslySetInnerHTML: definition.description})
    );
  }
}

module.exports = Definition;