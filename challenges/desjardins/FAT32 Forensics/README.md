
# FAT32 Forensics

## Challenge description

### Qu'est-ce que le digital forensics?

Le *Digital Forensics*, c'est l'ensemble des techniques qui visent à récupérer et à analyser les divers "artifacts" laissés par divers systèmes informatiques dans leurs opérations dans le but de comprendre ce qui s'est passé après coup sur lesdits systèmes informatiques. Le terme a été adopté du terme plus connu *[Forensics Science](https://en.wikipedia.org/wiki/Forensic_science)*, où, traditionnellement, des scientifiques amassent des éléments laissés par des criminels sur des scènes de crime afin de reconstruire des éléments utiles à l'enquête en cours (par exemple, des empreintes digitales).

Les systèmes informatiques qu'on utilise aujourd'hui, tels que les ordinateurs personnels, serveurs et téléphones, sont le fruit de décennies d'innovation et de dizaines de couches d'abstractions. Par exemple, sur le système d'exploitation Windows, il existe plusieurs façons de trouver l'existence d'un fichier, ainsi que sa dernière date de modification, après qu'il ait été supprimé complètement de l'ordinateur!

La pratique du *Digital Forensics* est utilisée dans deux cas principaux: lors d'enquêtes policières et lors de "Réponse aux Incidents", afin de comprendre ce qui a pu causer une brèche de sécurité et/ou afin d'amasser des *Indicators of Compromise (IoCs)*.

### Le défi

Voici un filesystem complet d'une machine Windows. Dans C:\Users\Administrator\Desktop\flags, tu trouveras beaucoup de fichiers. Un de ces fichiers n'est pas légitime et a été planté par un acteur malicieux qui avait un accès physique à la machine. Le fichier copié provient d'une clé USB formattée en FAT32. Trouve ce fichier, il contient de bon flag.

*Note: Pour résoudre le défi de la façon prévue, il faut monter (mount) le filesystem avec une machine Windows. C'est très simple à faire et ça se Google très bien :). Un tout petit peu de scripting devrait également être nécessaire, plusieurs langages font le travail, mais la solution a été testée avec Python 3.9.

Indice: Il existe plusieurs façons de résoudre ce défi, mais la façon prévue peut être découverte en lisant [la page wikipedia de FAT](https://en.wikipedia.org/wiki/File_Allocation_Table).


[Lien vers le filesystem](https://drive.google.com/file/d/1rDwUtrXpxFn3LEI8ojeJXpUF_Li35q9R/view?usp=sharing) (Utiliser 7Zip pour décompresser).

## Solution

Voir Solve.py. Un filesystem FAT32 stoque le temps de dernière modification d'un fichier avec une précision de 2 secondes. Pour NTFS, utilisé par Windows, c'est une précision à la nanoseconde, donc beaucoup plus précis. Quand Windows copie un fichier d'un endroit à un autre, il copie également le temps de modification dudit fichier. Le fichier copié d'une clé USB aura donc nécessairement un temps de modification rond (à la seconde près), tandis que tous les autres fichiers auront un temps de modification avec beaucoup de chiffres après la virgule. Solve.py liste le temps de modification de tous les fichiers. En les regardant rapidement, le fichier planté sort du lot:

```
<snip>
a6871cf0-652d-4008-92de-e6d632312689.txt 1610919235.076356
a6c8104a-bc61-400f-a965-26de1f214d93.txt 1610919841.5340257
a729be22-f7c2-43f1-8125-3798b18a692f.txt 1610919634.8554611
a74e8a78-2f76-4dc9-b2ca-0d59556bec0b.txt 1610920770.4272578
a76ed83e-e101-4490-a843-55d3c098a56d.txt 1610920372.5219362
a7c52f69-893b-4d9f-99b2-804b4083bc3a.txt 1610919655.2123146
a7d6721b-44ed-461c-9d13-b2e4f78b0c2d.txt 1610911176.6895223
a7e2fa2e-2744-44c0-bc49-44eef03dd55b.txt 1610920206.64343
a82ae56f-b4c3-4b3c-94b1-90ebd5b89f92.txt 1610920572.6200352
a8cb6946-cb6b-4aa3-8352-498b325457f9.txt 1610919339.7840724
a8f73beb-707c-4b13-9b64-daad6612068a.txt 1610910846.0          <---------------
a92374a9-ba8c-4796-94c2-002653ff64d2.txt 1610919281.0852354
a92f19da-fca2-4960-9ec8-68d7e7acd42a.txt 1610919676.644178
a94c7816-a609-4160-ada5-ac1a800ac1fd.txt 1610919771.4012313
a95a8a6b-50b6-434b-8f53-05f6e0d6426e.txt 1610919880.4457402
a960d2d8-e301-4067-9295-c08ed729e1d0.txt 1610920037.2651236
a972e927-a272-4107-b147-c57bf06b84d9.txt 1610919879.9166653
a9a2fe6d-f684-4566-b135-d8fc1ea22070.txt 1610920685.8611145
a9b9830f-9a65-41b7-aba5-6437203b7e24.txt 1610919063.8953414
a9f7bd16-81aa-4655-977f-b0d24b796a96.txt 1610920172.9007492
</snip>
```

Il s'agit donc de `a8f73beb-707c-4b13-9b64-daad6612068a.txt`, et donc le flag: `FLAG-8ca4da83eef75985b632c2fd7c388f34b323ab53ff0a5d71605a9c5156f0b843`.
