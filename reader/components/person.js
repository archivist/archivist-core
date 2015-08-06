var $$ = React.createElement;

// Prison view
// ----------------

class Person extends React.Component {
  handleEdit(e) {
    e.stopPropagation();
  }

  handleToggle(e) {
    e.preventDefault();
    this.props.handleToggle(this.props.entity.id);
  }

  render() {
    var person = this.props.entity;

    var className = ["entity person"];
    if (person.active) className.push("active");
    return $$("div", {className: className.join(" "), onClick: this.handleToggle},
      $$("div", {className: "type"}, "Person"),
      $$("div", {className: "name"}, person.name),
      $$("div", {className: "description"}, person.description)
    );
  }
}

module.exports = Person;