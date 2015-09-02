var $$ = React.createElement;

// Prison view
// ----------------

class Person extends React.Component {
  handleEdit(e) {
    e.stopPropagation();
  }

  handleToggle(e) {
    e.preventDefault();
    this.props.handleToggle(this.props.entity.id, this.props.entity.type);
  }

  render() {
    var person = this.props.entity;

    var className = ["entity person"];
    if (this.props.active) className.push("active");
    return $$("div", {"data-id": person.id, className: className.join(" "), onClick: this.handleToggle.bind(this)},
      $$("div", {className: "name"}, person.name),
      $$("div", {className: "description", dangerouslySetInnerHTML: person.description})
    );
  }
}

module.exports = Person;