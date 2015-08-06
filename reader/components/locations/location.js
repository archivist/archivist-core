var $$ = React.createElement;

// Prison view
// ----------------

class Location extends React.Component {
  handleEdit(e) {
    e.stopPropagation();
  }

  handleToggle(e) {
    e.preventDefault();
    this.props.handleToggle(this.props.entity.id);
  }

  render() {
    var location = this.props.entity;

    var className = ["entity location"];
    if (location.active) className.push("active");

    var name = (!location.current_name) ? location.name : location.current_name;
    return $$("div", {className: className.join(" "), onClick: this.handleToggle},
      $$("div", {className: "type"}, "Location"),
      $$("div", {className: "name"}, name),
      $$("div", {className: "synonyms"}, "Known as: " + location.synonyms.join(', ')),
      $$("div", {className: "country"}, "Country: " + location.country),
      $$("div", {className: "description"}, location.description)
    );
  }
}

module.exports = Location;