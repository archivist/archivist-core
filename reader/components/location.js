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

  handleClick(e) {
    e.stopPropagation();
  }

  render() {
    var toponym = this.props.entity;

    var className = ["entity location"];
    if (this.props.active) className.push("active");

    var location = toponym.country;

    if(toponym.name !== toponym.current_name && toponym.current_name) location = location + ", " + toponym.current_name;

    return $$("div", {"data-id": toponym.id, className: className.join(" "), onClick: this.handleToggle.bind(this)},
      $$("div", {className: "resource-header"},
        $$("div", {className: "name"}, toponym.name),
        $$("div", {className: "location"}, location)
      ),
      $$("a", {className: "show-resources", href: "/resources/" + toponym.id, target: "_blank", title: i18n.t("reader.show_resources")}, 
        $$("i", {className: "fa fa-book"})
      ),
      $$("a", {className: "show-on-map", href: "/maps/" + toponym.id, target: "_blank", title: i18n.t("reader.show_on_map")}, 
        $$("i", {className: "fa fa-crosshairs"})
      ),
      $$("div", {
        className: "description", 
        dangerouslySetInnerHTML: {__html: toponym.description }
      })
    );
  }
}

module.exports = Location;