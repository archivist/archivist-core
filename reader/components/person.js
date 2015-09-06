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

  handleClick(e) {
    e.stopPropagation();
  }

  render() {
    var person = this.props.entity;

    var className = ["entity person"];
    if (this.props.active) className.push("active");
    return $$("div", {"data-id": person.id, className: className.join(" "), onClick: this.handleToggle.bind(this)},
      $$("div", {className: "name"}, person.name),
      $$("a", {className: "show-resources", href: "/resources/" + person.id, target: "_blank", title: i18n.t("reader.show_resources"), onClick: this.handleClick.bind(this)}, 
        $$("i", {className: "fa fa-book"})
      ),
      $$("div", {
        className: "description",
        dangerouslySetInnerHTML: {__html: person.description }
      })
    );
  }
}

module.exports = Person;