import React from 'react';
import { DoAndDont } from '../../../../Backend/data/model/dosAndDontsModel';

interface DosAndDontsViewProps {
  dosAndDonts: DoAndDont[];
  selectedType: 'Do' | 'Don\'t';
  inputText: string;
  onTypeChange: (type: 'Do' | 'Don\'t') => void;
  onInputChange: (text: string) => void;
  onSaveClick: (fearId: string) => void;
}

const DosAndDontsView: React.FC<DosAndDontsViewProps> = ({
  dosAndDonts,
  selectedType,
  inputText,
  onTypeChange,
  onInputChange,
  onSaveClick,
}) => {
  return (
    <div className="DosAndDontsApp">
      <div>
        <label>
          Create a "Do"
          <input
            type="radio"
            value="Do"
            checked={selectedType === 'Do'}
            onChange={() => onTypeChange('Do')}
          />
        </label>
        <label>
          Create a "Don't"
          <input
            type="radio"
            value="Don't"
            checked={selectedType === "Don't"}
            onChange={() => onTypeChange("Don't")}
          />
        </label>
      </div>
      <input
        type="text"
        placeholder={`Enter ${selectedType.toLowerCase()} or don't`}
        value={inputText}
        onChange={(e) => onInputChange(e.target.value)}
      />
      <button onClick={() => onSaveClick('')}>Save</button>

      {dosAndDonts.map((item) => (
        <div key={item._id}>
          <h4>{item.type}</h4>
          <p>{item.text}</p>
        </div>
      ))}
    </div>
  );
};

export default DosAndDontsView;

