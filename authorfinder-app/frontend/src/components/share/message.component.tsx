import { Search, Heart, ListPlus, Book, Pencil, Trash2, X, AlertCircle, Sparkles } from 'lucide-react';
import { useState } from 'react';



interface MessageBoxProps {
  message: string;
  type: string;
  onMessageBoxAction: (action: string) => void;
}


function MessageBox(props: MessageBoxProps) {

  const { message, type, onMessageBoxAction } = props;

  let bgColor, textColor, icon;

  switch (type) {
    case 'success':
      bgColor = 'alert alert-success';
      textColor = 'text-black';
      icon = '✅';
      break;
    case 'error':
      bgColor = 'alert alert-danger';
      textColor = 'text-black';
      icon = <AlertCircle size={24} className="text-black" />;
      break;
    case 'info':
      bgColor = 'alert alert-primary';
      textColor = 'text-black';
      icon = 'ℹ️';
      break;
    case 'confirm':
      bgColor = 'alert alert-warning';
      textColor = 'text-black';
      icon = '⚠️';
      return (
        <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-xl flex flex-col items-start gap-3 z-[100] ${bgColor} text-primary-emphasis`}>
          <div className="flex items-center gap-3 w-full">
            <div className="text-2xl">{icon}</div>
            <p className="font-semibold flex-grow">{message}</p>
            <button onClick={() => handleMessageBoxAction('cancel')} className="ml-auto text-black hover:text-gray-200">
              <X size={20} />
            </button>
          </div>
          <div className="flex justify-end w-full gap-2 mt-2">
            <button
              onClick={() => handleMessageBoxAction('confirm')}
              className="bg-white text-yellow-700 font-semibold py-1 px-3 rounded-md hover:bg-gray-100 transition duration-150"
            >
              Yes
            </button>
            <button
              onClick={() => handleMessageBoxAction('cancel')}
              className="bg-yellow-700 text-black font-semibold py-1 px-3 rounded-md hover:bg-yellow-800 transition duration-150"
            >
              No
            </button>
          </div>
        </div>
      );
    default:
      bgColor = 'alert alert-secondary';
      textColor = 'text-black';
      icon = '💬';
  }

  const handleMessageBoxAction = (action: string) => {
    onMessageBoxAction(action);
  };

  return (

    <div className={` ${bgColor} text-primary-emphasis`}>
      <div className="row">
        <p className="font-semibold"><span>{icon}</span> {message}</p>
      </div>
    </div>
  );
};

export default MessageBox;