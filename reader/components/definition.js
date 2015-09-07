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

  handleClick(e) {
    e.stopPropagation();
  }

  render() {
    var definition = this.props.entity;

    var className = ["entity definition"];
    if (this.props.active) className.push("active");
    var children = [$$("div", {className: "title"}, definition.title)];
    // TODO: we should think about better options to excluding links for some definitions types
    if(definition.definition_type == 'лагерная реалия' || definition.definition_type == 'общий комментарий') {
      children.push($$("a", {className: "show-resources", href: "/resources/" + definition.id, target: "_blank", title: i18n.t("reader.show_resources"), onClick: this.handleClick.bind(this)}, 
        $$("i", {className: "fa fa-book"})
      ));
    }
    children.push($$("div", {
      className: "description", 
      dangerouslySetInnerHTML: {__html: definition.description }
    }));
    return $$("div", {"data-id": definition.id, className: className.join(" "), onClick: this.handleToggle.bind(this)}, children);
  }
}

module.exports = Definition;