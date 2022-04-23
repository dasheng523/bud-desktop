import React, { useState } from 'react';
import BraftEditor from 'braft-editor'
import { ContentUtils } from 'braft-utils';
import 'braft-editor/dist/index.css'
import { Upload, Button } from 'antd';
import { UploadChangeParam  } from 'antd/lib/upload';
import { LoadingOutlined, AreaChartOutlined } from '@ant-design/icons';

import { envGet } from '../../services/EnvLoader';

interface FormProps {
  value?: string;
  onChange?: (newValue: string) => void
}

const YsEditor: React.FC<FormProps> = ({ value, onChange }) => {
  const [content, setContent] = useState<string>(BraftEditor.createEditorState(value));
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (info: UploadChangeParam) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      if (info.file.response.code == 200) {
        const url:string = info.file.response.data;
        if (url) {
          setLoading(false);
          setContent(ContentUtils.insertMedias(content, [{
            type: 'IMAGE',
            url: url
          }]));
        }
      }
    }
  };

  return (
    <BraftEditor 
      controls={['font-size', 'text-color', 'bold', 'italic', 'underline', 'separator', 'link', 'separator', 'text-align', 'hr', 'fullscreen']}
      extendControls={[{
        key: 'antd-uploader',
        type: 'component',
        component: (
          <Upload
            accept="image/*"
            showUploadList={false}
            action={envGet("serverBase") +"/common/uploadFile"}
            onChange={handleChange}
          >
            <Button className="control-item button upload-button">
              {loading ? <LoadingOutlined /> : <AreaChartOutlined />}
              插入图片
              </Button>
          </Upload>
        )
      }]}
      className="editor"
      value={content} 
      onChange={(editorState) => {
        setContent(editorState);
        const htmlContent = editorState.toHTML();
        if (onChange) {
          onChange(htmlContent);
        }
      }} />
  );
}

export default YsEditor;