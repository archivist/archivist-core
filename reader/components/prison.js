var $$ = React.createElement;

// Prison view
// ----------------

class Prison extends React.Component {
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
    var prison = this.props.entity;

    var className = ["entity prison"];
    var prisonType = (prison.prison_type instanceof Array ? prison.prison_type.join(', ') : '');
    var name = prison.name.toLowerCase().indexOf("неизвестно") >= 0 ? i18n.t('entity.unknown_name') : prison.name;
    var location = prison.country;
    if (prison.nearest_locality) location = location + ', ' + prison.nearest_locality;
    if (this.props.active) className.push("active");
    
    return $$("div", {"data-id": prison.id, className: className.join(" "), onClick: this.handleToggle.bind(this)},
      $$("div", {className: "resource-header"},
        $$("div", {className: "entity-type"}, prisonType),
        $$("div", {className: "location"}, location)
      ),
      $$("a", {className: "show-resources", href: "/resources/" + prison.id, target: "_blank", title: i18n.t("reader.show_resources"), onClick: this.handleClick.bind(this)}, 
        $$("i", {className: "fa fa-book"})
      ),
      $$("a", {className: "show-on-map", href: "/maps#" + prison.id, target: "_blank", title: i18n.t("reader.show_on_map"), onClick: this.handleClick.bind(this)}, 
        $$("i", {className: "fa fa-crosshairs"})
      ),
      $$("div", {className: "name"}, name),
      $$("div", {
        className: "description",
        dangerouslySetInnerHTML: {__html: prison.description }
      })
    );
  }
}

module.exports = Prison;