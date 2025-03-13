import React, { Component, createRef } from "react";
import PropTypes from "prop-types";
import { getCursorPosition, isValidIPSegment } from "./helper";
import { Input } from "./components/input";
import "./ipinput.css";
import { cn } from "./lib/utils"

interface IPutProps {
  className?: string;
  defaultValue?: string | string[];
  isError?: (ip: string) => boolean;
  onChange?: (ip: string) => void;
  onBlur?: (ip: string) => void;
}

interface IPutState {
  value: (number | string)[];
}

export default class IPut extends Component<IPutProps, IPutState> {
  static defaultProps: Partial<IPutProps> = {
    className: "",
    defaultValue: "...",
    isError: () => false,
    onChange: () => {},
    onBlur: () => {},
  };

  static propTypes = {
    className: PropTypes.string,
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    isError: PropTypes.func,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
  };

  private inputRefs: React.RefObject<HTMLInputElement>[];

  constructor(props: IPutProps) {
    super(props);
    this.state = { value: [] };
    this.inputRefs = Array(4)
      .fill(null)
      .map(() => createRef<HTMLInputElement>());
  }

  componentDidMount() {
    const { defaultValue } = this.props;
    const valueArray = Array.isArray(defaultValue)
      ? defaultValue
      : defaultValue?.split(".") || [];
    this.setState({
      value: valueArray.map((v) =>
        v === "" || isNaN(Number(v)) ? "" : Number(v)
      ),
    });
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
    let val = parseInt(e.target.value, 10);
    val = isNaN(val) || !isValidIPSegment(val) ? "" : val;
    const value = [...this.state.value];
    value[i] = val;
    this.setState({ value }, this.onPropsChange);
    if (!isNaN(Number(val)) && String(val).length === 3 && i < 3) {
      this.inputRefs[i + 1]?.current?.focus();
    }
  };
  handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, i: number) => {
    const { keyCode, target } = e;
    const input = target as HTMLInputElement;
    let domId = i;
    if (
      (keyCode === 37 || keyCode === 8) &&
      getCursorPosition(input).end === 0 &&
      i > 0
    ) {
      domId = i - 1;
    }
    if (
      keyCode === 39 &&
      getCursorPosition(input).end === input.value.length &&
      i < 3
    ) {
      domId = i + 1;
    }
    if (keyCode === 110 || keyCode === 190) {
      e.preventDefault();
      if (i < 3) domId = i + 1;
    }
    this.inputRefs[domId]?.current?.focus();
  };

  handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, i: number) => {
    const pasteData = e.clipboardData.getData("text/plain");
    if (!pasteData) return;
    const value = pasteData.split(".").map((v) => parseInt(v, 10));
    if (value.length !== 4 - i || !value.every(isValidIPSegment)) return;
    const oldValue = [...this.state.value];
    value.forEach((val, j) => {
      oldValue[i + j] = val;
    });
    this.setState({ value: oldValue }, this.onPropsChange);
    e.preventDefault();
  };

  handleBlur = () => {
    const ip = this.state.value
      .map((val) => (isNaN(Number(val)) ? "" : val))
      .join(".");
    this.props.onBlur?.(ip);
  };

  onPropsChange = () => {
    const ip = this.state.value
      .map((val) => (isNaN(Number(val)) ? "" : val))
      .join(".");
    this.props.onChange?.(ip);
  };

  render() {
    const { value } = this.state;
    const ip = value.map((val) => (isNaN(Number(val)) ? "" : val)).join(".");

    const className = [
      "react-ip-input",
      this.props.className,
      this.props.isError?.(ip) ? "has-error" : "",
    ].join(" ");

    return (
      <div
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
      >
        {value.map((val, i) => (
          <div contentEditable={false} className="react-ip-input__item" key={i}>
            <input
              ref={this.inputRefs[i]}
              type="text"
              value={isNaN(Number(val)) ? "" : val}
              onChange={(e) => this.handleChange(e, i)}
              onKeyDown={(e) => this.handleKeyDown(e, i)}
              onPaste={(e) => this.handlePaste(e, i)}
              onBlur={this.handleBlur}
              onFocus={this.handleFocus}
            />
            {i !== 3 && <div>.</div>}
          </div>
        ))}
      </div>
    );
  }
}
