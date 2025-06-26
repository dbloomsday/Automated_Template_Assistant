interface Props {
  base64: string;
}

export function PreviewViewer({ base64 }: Props) {
  return (
    <div className="p-4 border-t">
      <img src={`data:image/png;base64,${base64}`} alt="Card preview" className="mx-auto shadow-lg" />
    </div>
  );
}
