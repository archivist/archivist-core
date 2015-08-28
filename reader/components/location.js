var $$ = React.createElement;

// Prison view
// ----------------

class Location extends React.Component {
  handleEdit(e) {
    e.stopPropagation();
  }

  handleToggle(e) {
    e.preventDefault();
    this.props.handleToggle(this.props.entity.id, this.props.entity.type);
  }

  render() {
    var location = this.props.entity;

    var className = ["entity location"];
    if (this.props.active) className.push("active");

    var name = (!location.current_name) ? location.name : location.current_name;
    return $$("div", {"data-id": location.id, className: className.join(" "), onClick: this.handleToggle.bind(this)},
      $$("div", {className: "type"}, "Location"),
      $$("div", {className: "name"}, name),
      $$("div", {className: "synonyms"}, "Known as: " + location.synonyms.join(', ')),
      $$("div", {className: "country"}, "Country: " + location.country),
      $$("div", {className: "description"}, location.description)
    );
  }
}

module.exports = Location;