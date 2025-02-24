import React, { useEffect, useRef, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Input, Tag, theme } from "antd";
import { TweenOneGroup } from "rc-tween-one"; // For animation

interface TagInputProps {
  initialTags: string[];
  onChange: (tags: string[]) => void;
}

const TagInput: React.FC<TagInputProps> = ({ initialTags, onChange }) => {
  const { token } = theme.useToken();
  const [tags, setTags] = useState(initialTags);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<Input | null>(null);

  // Focus the input when it becomes visible
  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  // Handle tag removal
  const handleClose = (removedTag: string) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    setTags(newTags);
    onChange(newTags); // Notify the parent component about the change
  };

  // Toggle visibility of the input field
  const showInput = () => {
    setInputVisible(true);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // Handle adding new tag when Enter key is pressed or input loses focus
  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      const newTags = [...tags, inputValue];
      setTags(newTags);
      onChange(newTags); // Notify the parent component about the change
    }
    setInputVisible(false); // Hide the input field
    setInputValue(""); // Clear input value
  };

  // Render the tags
  const forMap = (tag: string) => (
    <span key={tag} style={{ display: "inline-block" }}>
      <Tag
        closable
        onClose={(e) => {
          e.preventDefault();
          handleClose(tag);
        }}
      >
        {tag}
      </Tag>
    </span>
  );

  // Define animation style for adding/removing tags
  const tagChild = tags?.map(forMap);

  // Style for the "New Tag" button
  const tagPlusStyle: React.CSSProperties = {
    background: token.colorBgContainer,
    borderStyle: "dashed",
  };

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <TweenOneGroup
          appear={false}
          enter={{ scale: 0.8, opacity: 0, type: "from", duration: 100 }}
          leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
          onEnd={(e) => {
            if (e.type === "appear" || e.type === "enter") {
              (e.target as any).style = "display: inline-block";
            }
          }}
        >
          {tagChild}
        </TweenOneGroup>
      </div>
      {inputVisible ? (
        <Input
          ref={inputRef}
          type="text"
          size="small"
          style={{ width: 78 }}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm} // Confirm when input loses focus
          onPressEnter={handleInputConfirm} // Confirm when Enter key is pressed
        />
      ) : (
        <Tag onClick={showInput} style={tagPlusStyle}>
          <PlusOutlined /> New Tag
        </Tag>
      )}
    </>
  );
};

export default TagInput;
