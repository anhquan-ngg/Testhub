import React from 'react';
import { Button } from '@/components/ui/button';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Plus, Trash2, GripVertical } from 'lucide-react';

const questionTypeMap = {
  'single-choice': 'Một đáp án',
  'multiple-choice': 'Nhiều đáp án',
  'fill-in-blank': 'Tự luận'
};

const QuestionList = ({ 
  questions, 
  onQuestionsChange,
  onAddFromBank
}) => {
  // Xử lý xóa câu hỏi
  const handleDeleteQuestion = (questionId) => {
    const newQuestions = questions.filter(q => q.id !== questionId);
    // Cập nhật lại order sau khi xóa
    const updatedQuestions = newQuestions.map((q, index) => ({
      ...q,
      order: index + 1
    }));
    onQuestionsChange(updatedQuestions);
  };

  // Xử lý kéo thả câu hỏi
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Cập nhật lại order sau khi kéo thả
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index + 1
    }));

    onQuestionsChange(updatedItems);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-start">
        <Button
          type="button"
          className="bg-black text-white hover:bg-gray-800"
          onClick={onAddFromBank}
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm từ ngân hàng
        </Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="questions">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {questions.map((question, index) => (
                <Draggable
                  key={question.id}
                  draggableId={question.id.toString()}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="flex items-center gap-2 p-2 sm:p-3 border rounded-lg bg-background"
                    >
                      <div {...provided.dragHandleProps} className="hidden sm:block">
                        <GripVertical className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm sm:text-base break-words">{question.content || question.text}</div>
                        <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                          {questionTypeMap[question.type]} - {question.score} điểm
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0"
                        onClick={() => handleDeleteQuestion(question.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className="text-xs sm:text-sm text-muted-foreground">
        Tổng số câu hỏi: {questions.length}
      </div>
    </div>
  );
};

export default QuestionList; 