var $$ = React.createElement;

// Prison view
// ----------------

class Prison extends React.Component {
  handleEdit(e) {
    e.stopPropagation();
  }

  handleToggle(e) {
    e.preventDefault();
    this.props.handleToggle(this.props.entity.id);
  }

  render() {
    var prison = this.props.entity;

    var className = ["entity prison"];
    var prisonType = (prison.prison_type instanceof Array ? prison.prison_type.join(', ') : 'unknown');
    var name = prison.name.toLowerCase().indexOf("неизвестно") >= 0 ? prison.nearest_locality : prison.name;
    if (prison.active) className.push("active");
    return $$("div", {className: className.join(" "), onClick: this.handleToggle},
      $$("div", {className: "type"}, "Prison"),
      $$("div", {className: "name"}, name),
      $$("div", {className: "prison-type"}, "Prison type: " + prisonType),
      $$("div", {className: "synonyms"}, "Known as: "+ prison.synonyms.join(', ')),
      $$("div", {className: "country"}, "Country: "+prison.country),
      $$("div", {className: "description"}, prison.description)
    );
  }
}

module.exports = Prison;