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
    if (prison.active) className.push("active");
    var name = this.props.name != this.props.current_name ? this.props.current_name : this.props.name;
    return $$("div", {className: className.join(" "), onClick: this.handleToggle},
      $$("div", {className: "type"}, "Location"),
      $$("div", {className: "name"}, this.props.name),
      $$("div", {className: "synonyms"}, "Known as: "+ this.props.synonyms.join(', ')),
      $$("div", {className: "country"}, "Country: "+this.props.country),
      $$("div", {className: "description"}, this.props.description),
    );
  }
}

module.exports = Location;