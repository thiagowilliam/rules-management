// MUDANÇAS MÍNIMAS NO SEU CÓDIGO EXISTENTE

// 1. Adicionar o estado para o item selecionado (após a linha 21):
const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

// 2. Adicionar useEffect para selecionar o primeiro item (após linha 23):
useEffect(() => {
  if (rulesResponse?.length > 0 && !selectedItemId) {
    setSelectedItemId(rulesResponse[0].id);
  }
}, [rulesResponse, selectedItemId]);

// 3. Modificar o useMemo existente (substituir o useMemo atual pelas linhas 25-35):
const rules = useMemo(() => {
  if (!rulesResponse || !selectedItemId) {
    return [];
  }
  
  // Em vez de sempre pegar o primeiro item [0], buscar pelo selectedItemId
  const selectedItem = rulesResponse.find(item => item.id === selectedItemId);
  return Array.isArray(selectedItem?.rules) ? selectedItem.rules : [];
}, [rulesResponse, selectedItemId]);

// 4. Adicionar função para selecionar item (antes do handleRuleSelect):
const handleItemSelect = (itemId: string) => {
  setSelectedItemId(itemId);
  setSelectedRuleId(null); // Reset da regra selecionada
};

// 5. Modificar o onClick do botão na linha 84:
onClick={() => handleItemSelect(item.id)}

// EXEMPLO COMPLETO DA MUDANÇA NO BOTÃO:
{rulesResponse?.map(item => (
  <button 
    type="button" 
    id={`select-item-${item.id}`} // ID único
    key={item.id}
    onClick={() => handleItemSelect(item.id)} // Nova função
    style={{
      backgroundColor: selectedItemId === item.id ? '#1976d2' : '#f5f5f5',
      color: selectedItemId === item.id ? 'white' : '#333',
      // ... outros estilos
    }}
  >
    {item.name}
  </button>
))}