from datetime import datetime
from pathlib import Path
import json

BASE = Path(__file__).parent
TXT = BASE / "fornecedores.txt"
SAIDA = BASE / "fornecedores_completo.json"
SAIDA_RUNTIME = BASE / "data" / "fornecedores.json"


def ler_texto(caminho: Path) -> str:
    bruto = caminho.read_bytes()
    for encoding in ("utf-8-sig", "cp1252", "latin-1"):
        try:
            return bruto.decode(encoding)
        except UnicodeDecodeError:
            continue
    raise UnicodeDecodeError("utf-8", bruto, 0, 1, "Nao foi possivel decodificar o TXT")


def campo(valor: str) -> str:
    return valor if valor is not None else ""


def parse_fornecedores(texto: str):
    fornecedores = []
    created_at = datetime.now().isoformat()

    for linha in texto.splitlines():
        partes = linha.split("\t")
        if len(partes) < 4:
            continue

        nome = campo(partes[1]).strip()
        site = campo(partes[2])
        telefone = campo(partes[3])

        if not nome or nome.lower() == "fornecedor":
            continue

        fornecedores.append({
            "id": len(fornecedores) + 1,
            "nome": nome,
            "site_instagram": site,
            "telefone": telefone,
            "observacoes": "",
            "prioritario": False,
            "ativo": True,
            "created_at": created_at,
        })

    return fornecedores


def salvar(caminho: Path, payload: dict) -> None:
    caminho.parent.mkdir(parents=True, exist_ok=True)
    with caminho.open("w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)
        f.write("\n")


if __name__ == "__main__":
    fornecedores = parse_fornecedores(ler_texto(TXT))
    payload = {
        "fornecedores": fornecedores,
        "proximo_id": len(fornecedores) + 1,
    }
    salvar(SAIDA, payload)
    salvar(SAIDA_RUNTIME, payload)
    print(f"Gerado {len(fornecedores)} fornecedores a partir de {TXT.name}")
