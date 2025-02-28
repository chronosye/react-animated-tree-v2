import React from "react";
import PropTypes from "prop-types";
import { Spring, config, animated } from "react-spring";
import * as Icons from "./icons";

const treeStyles = {
    tree: {
        position: "relative",
        padding: "4px 0px 0px 0px",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        overflow: "hidden",
        verticalAlign: "middle",
    },
    toggle: {
        width: "1em",
        height: "1em",
        marginRight: 10,
        cursor: "pointer",
        verticalAlign: "middle",
    },
    type: {
        textTransform: "uppercase",
        fontFamily: "monospace",
        fontSize: "0.6em",
        verticalAlign: "middle",
    },
    contents: {
        willChange: "transform, opacity, height",
        marginLeft: 6,
        padding: "4px 0px 0px 14px",
        borderLeft: "1px dashed rgba(255,255,255,0.4)",
    },
};

export default class Tree extends React.PureComponent {
    static defaultProps = { open: false, visible: true, canHide: false, icons: {} };
    static propTypes = {
        open: PropTypes.bool,
        visible: PropTypes.bool,
        canHide: PropTypes.bool,
        content: PropTypes.node,
        springConfig: PropTypes.func,
        itemId: PropTypes.string,
        onItemClick: PropTypes.func,
        onItemToggle: PropTypes.func,
        icons: PropTypes.object,
    };

    constructor(props) {
        super();
        this.state = { open: props.open, visible: props.visible, immediate: false, id: props.itemId };
    }

    toggle = () => {
        if (typeof this.props.children !== "undefined") {
            this.props.onItemToggle && this.props.onItemToggle(this.state.id, !this.state.open);
            this.setState((state) => ({ open: !state.open, immediate: false }));
        }
    };

    toggleVisibility = () => {
        this.setState(
            (state) => ({ visible: !state.visible, immediate: true }),
            () => this.props.onClick && this.props.onClick(this.state.visible)
        );
    };

    onItemClick = () => {
        this.props.onItemClick && this.props.onItemClick(this.state.id);
    };

    componentWillReceiveProps(props) {
        this.setState((state) => {
            return ["open", "visible"].reduce(
                (acc, val) => (this.props[val] !== props[val] ? { ...acc, [val]: props[val] } : acc),
                {}
            );
        });
    }

    render() {
        const { open, visible, immediate } = this.state;
        const { children, content, type, style, canHide, springConfig, icons } = this.props;

        const icon = children
            ? open
                ? icons.minusIcon || "Minus"
                : icons.plusIcon || "Plus"
            : icons.closeIcon || "Close";
        const Icon = typeof icon === "string" ? Icons[icon] : icon;
        const IconEye = icons.eyeIcon || Icons.Eye;

        return (
            <div style={{ ...treeStyles.tree, ...style }} className="treeview">
                <Icon
                    className="toggle"
                    style={{ ...treeStyles.toggle, opacity: children ? 1 : 0.3 }}
                    onClick={this.toggle}
                />
                <span style={{ ...treeStyles.type, marginRight: type ? 10 : 0 }}>{type}</span>
                {canHide && (
                    <IconEye
                        className="toggle"
                        style={{ ...treeStyles.toggle, opacity: visible ? 1 : 0.4 }}
                        onClick={this.toggleVisibility}
                    />
                )}
                <span onClick={this.onItemClick} style={{ verticalAlign: "middle" }}>
                    {content}
                </span>
                <Spring
                    native
                    immediate={immediate}
                    config={{
                        ...config.default,
                        restSpeedThreshold: 1,
                        restDisplacementThreshold: 0.01,
                    }}
                    from={{ height: 0, opacity: 0, transform: "translate3d(20px,0,0)" }}
                    to={{
                        height: open ? "auto" : 0,
                        opacity: open ? 1 : 0,
                        transform: open ? "translate3d(0px,0,0)" : "translate3d(20px,0,0)",
                    }}
                    {...(springConfig && springConfig(open))}
                >
                    {(styles) => <animated.div style={{ ...styles, ...treeStyles.contents }}>{children}</animated.div>}
                </Spring>
            </div>
        );
    }
}
